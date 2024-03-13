import { BadRequestException, ConflictException, Injectable, Res } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Reservation } from './entities/reservation.entity';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { CreateReservationDto } from './dto/create.reservation.dto';
import { UsersModel } from 'src/users/entities/users.entity';
import { UpdatereservationDto } from './dto/update.reservation.dto';
import { Point } from 'src/points/entities/point.entity';
import { Seat } from 'src/seats/entities/seat.entity';
import { Show } from 'src/shows/entities/show.entity';
import { resolve } from 'path';
import { Schedule } from 'src/schedule/entities/schedule.entity';

@Injectable()
export class ReservationsService {
    constructor(
        @InjectRepository(Reservation)
        private readonly reservationRepository: Repository<Reservation>,
        @InjectRepository(Point)
        private readonly pointRepository: Repository<Point>,
        @InjectRepository(Seat)
        private readonly seatRepository: Repository<Seat>,
        @InjectRepository(Show)
        private readonly showRepository: Repository<Show>,
        @InjectRepository(Schedule)
        private readonly scheduleRepository: Repository<Schedule>,
        private dataSource: DataSource,
        ){}


    // 공연 생성
    async createReservation(seat: any, id: any, showId: any, bodyScheduleId: number)
    {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction('READ COMMITTED'); // 격리 수준
        try{
            // 공연 테이블에서 가격, 등급별 개수 가져오기
            const gradeInfo = await this.showRepository.findOne({
                where: { id: showId },
            });
            // 스케줄 id
            const schedule: any = await this.scheduleRepository.findOne({
                where: { id: bodyScheduleId },
                select: ['id', 'AClassLimit', 'BClassLimit', 'SClassLimit'],
            });
            console.log(2)
            console.log(schedule)
            
            for(const data of seat) {
                if(
                    data.grade === 'AClass' && 
                    data.seatNum > schedule.AClassLimit
                ){
                    throw new Error('좌석 번호를 다시 확인해주세요.');
                } else if(
                    data.grade === 'BClass' && 
                    data.seatNum > schedule.BClassLimit
                ) {
                    throw new Error('좌석 번호를 다시 확인해주세요.');
                } else if(
                    data.grade === 'SClass' &&
                    data.seatNum > schedule.SClassLimit
                ) {
                    throw new Error('좌석 번호를 다시 확인해주세요')
                }
            }

            // 1. 예매 테이블 생성하기
            const createdReservation: any = await queryRunner.manager.save(
                Reservation,
                {
                    user: id,
                    show: showId,
                    schedule: schedule.id
                },
            );
            console.log(1)
            console.log(createdReservation)

            // 2. 좌석 테이블 생성
            let totalPoint = 0;
            for(let i = 0; i < seat.length; i++){
                const checkSeat = await queryRunner.query(
                    `
                    SELECT * FROM seats
                    WHERE "scheduleId" = $1 AND grade = $2 AND "seatNum" = $3 
                    `,
                    [schedule.id, seat[i].grade, seat[i].seatNum],
                );
                console.log(10)
                if(checkSeat.length !== 0){
                    throw new ConflictException('이미 예매된 좌석입니다.');
                }
                const [limitedSeatCheckawait, count] = await queryRunner.manager.findAndCount(Seat, {
                    where: {
                        schedules: schedule.id,
                        grade: seat[i].grade,
                        show: showId,
                    },
                });
                console.log(11)
                console.log(count)

                // grade별 저해진 좌석수와 예매된 좌석수 비교
                let isWithinLimit =false;
                let finalPrice = 0;
                if(seat[i].grade === 'BClass' && count < schedule.BClassLimit) {
                    isWithinLimit = true;
                    finalPrice = gradeInfo.price;
                } else if (seat[i].grade === 'AClass' && count < schedule.AClassLimit) {
                    isWithinLimit = true;
                    finalPrice = gradeInfo.price * 1.5;
                } else if (seat[i].grade === 'SClass' && count < schedule.SClassLimit) {
                    isWithinLimit = true;
                    finalPrice = gradeInfo.price * 1.75;
                }
                console.log(13)
                console.log(showId)

                // 좌석 저장
                if(isWithinLimit) {
                    await queryRunner.manager.save(Seat, { 
                        show: showId,
                        user: id,
                        reservation: createdReservation.id,
                        schedules: schedule.id,
                        grade: seat[i].grade,
                        seatNum: seat[i].seatNum,
                        seatPrice: finalPrice,
                    });
                    totalPoint += finalPrice;
                } else {
                    throw new Error();
                }
            }

            // 3. 포인트 결제

            const lastPoint = await queryRunner.manager.find(Point, {
                where: { user: id },
                order: { createdAt: 'DESC'},
                take: 1,
            });
            console.log(20)
            console.log(lastPoint[0])

            // 포인트 상태 변경
            if(lastPoint[0].balance < totalPoint) {
                throw new Error('잔액 부족');
            }
            await queryRunner.manager.save(Point, {
                userId : id,
                reservation: createdReservation.id,
                income: 0,
                expense: totalPoint,
                balance: lastPoint[0].balance - totalPoint,
            });

            await queryRunner.commitTransaction();
            return { status : 201, message: '예매 성공'};
        } catch(error) {
            console.log(error);
            await queryRunner.rollbackTransaction();
            return { status: 500, message: '예매 실패'};
        } finally {
            await queryRunner.release();
        }
    }

    // 예매 목록 조회
    async findAll(user: any) {
        const reservationByUser = await this.reservationRepository.find({
            where: { user: user.id},
            order: { createdAt: 'DESC'},
            relations: ['show'],
        });
        return { reservationByUser };
    }

    // 예매 취소 
    async cancle(value: number, user: any) {
        const userId = user.id;
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        console.log(0)

        try{
            // 2시간전에 예매취소 가능해서 2시간전 인지 확인
            const getStartTime = await queryRunner.manager.findOne(Reservation, {
                where: { id: value },
                relations: ['schedule'],
            });
            console.log(10)
            console.log(value)
            
            console.log(getStartTime)
            

            const startTime = getStartTime.schedule.startTime;
            const timeCheck = await queryRunner.query(
                ` 
                SELECT * 
                FROM schedule
                WHERE $1::timestamp - $2::timestamp < INTERVAL '2 hours'

                `,
                [new Date(), startTime],
            );
            if(timeCheck.length === 0) {
                console.log('유효기간 지남');
                throw new Error();
            }
            console.log(1)
            // ------------------------------------------- 시트 로직 -----------------------------------------------------------------
            // 취소하고자 하는 좌석 칼럼 삭제
            await queryRunner.manager.delete(Seat, { reservation: value }); // 이 시트에 있는 이 모든 reservation 정보를 삭제
            console.log(1)

            //---------------- 예약 로직
            await queryRunner.manager.update(
                Reservation,
                { id: value },
                { status: false },
            );
            // 에매 정보는 남기고 시트 정보만 지움

            console.log(2)


            // ----------------------------------------- 포인트 로직 --------------------------------------------------------------------

            // 포인트 로직 1. 환불하려는 유저를 조회해서 그 유저의 현재 포인트를 currentUserBalance에 저장한다.
            const currentUserPointTable = await queryRunner.manager.find(Point, {
                where: { userId: userId },
                order: { createdAt: 'DESC' },
                take: 1, // 하나만 가져온 최신정보만
            });
            const currentUserBalance = currentUserPointTable[0].balance;
            console.log(3)

            // 포인트 로직 2. 취소할 거래 내역을 가져와서 환불할 예매의 지출 포인트를 가져와서 refundedPointValue에 넣는다.
            const refundedPoint = await queryRunner.manager.findOne(Point, {
                where: { reservation: { id: value }},
            })
            const refundedPointValue = refundedPoint.expense;
            console.log(4)

            // 포인트 로직 3. 환불 컬럼을 생성 reservation 테이블의 status(예매상태)를 가져옴 만약 예매 상태가 취소상태면 에러만들고 아니면 
            const reservationStatus = await queryRunner.manager.findOne(Reservation, {
                where: { id: value },
                select: ['status'],
            });
            console.log(5)

            // 예매 상태가 false(취소) 일때
            if(reservationStatus.status) {
                throw new Error();
            }
            console.log(1)
            console.log(value)

            // 포인트 로직 4. 예약할때 비용(expence)을 수입(income)에 넣고 현재 포인트(balance)는 currentUserBalance(현재 포인트) + refundedPointValue(환불받는 금액)로 한다.
            await queryRunner.manager.save(Point, {
                userId: userId,
                reservation: {id: value},
                income: refundedPoint.expense,
                expence: 0,
                balance: currentUserBalance + refundedPointValue,
            });
            console.log(6)

            await queryRunner.commitTransaction();
            return { status: 201, messege: '예매 환불 성공'}
        } catch(error) {
            console.log(error);
            await queryRunner.rollbackTransaction();
            return { status: 500, message: '예매 환불 실패'};
        } finally {
            await queryRunner.release();
        }
    }

    async isReservationMine(userId: number, reservationId: number) {
        return this.reservationRepository.exists({
            where: {
                id: reservationId,
                user: {
                    id: userId,
                }
            },
            relations: {
                user: true,
            }
        })
    }
}