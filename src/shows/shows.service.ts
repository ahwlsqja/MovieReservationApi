import _ from 'lodash';
import { parse } from 'papaparse';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Like, MoreThan, QueryRunner, Repository } from 'typeorm';
import { Show } from './entities/show.entity';
import { Category } from './types/category.type';
import { CreateShowDto } from './dto/show.create.dto';
import { UpdateShowDto } from './dto/show.update.dto';
import { PaginateShowDto } from './dto/paginte-show.dto';
import { basename, join } from 'path';
import { PUBLIC_FOLDER_PATH, SHOWS_IMAGE_PATH, TEMP_FOLDER_PATH } from 'src/common/const/path.const';
import { promises } from 'fs'; 
import { ImageModel } from 'src/common/entity/image.entity';
import { Schedule } from 'src/schedule/entities/schedule.entity';
import { privateDecrypt } from 'crypto';
import { Seat } from 'src/seats/entities/seat.entity';
import { CreateScheduleDto } from 'src/schedule/dto/create-schedule.dto';

@Injectable()
export class ShowsService {
    constructor(
        @InjectRepository(Show)
        private readonly showRepository: Repository<Show>,
        @InjectRepository(Schedule)
        private readonly scheduleRepository: Repository<Schedule>,
        @InjectRepository(Seat)
        private readonly seatRepository: Repository<Seat>,
        private dataSource: DataSource,
    ){}

    // 공연 생성
    async createShow(
        createShowDto : CreateShowDto,
        createScheduleDto : CreateScheduleDto,
        playDate: any,
        ){
        // 트랜 잭션
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try{
            const show = await this.showRepository.save(createShowDto); // 쇼 정보 저장
            const id: any = show.id // 그 저장한 쇼의 id를 id라는 변수에 저장

            // 스케쥴 테이블 작성
            const { startTime, endTime, AClassLimit, BClassLimit, SClassLimit } = createScheduleDto;
            await this.scheduleRepository.save({
                show: id,
                startTime: `${playDate.playDate} ${startTime}`,
                endTime: `${playDate.playDate} ${endTime}`,
                AClassLimit,
                BClassLimit,
                SClassLimit,
            });
            // 트랜잭션 커밋 모든 작업이 성공적으로 완료되었을 때 트랜잭션을 커밋(확정)한다. 데이터베이스에 변경사항을 반영하라는 명령어다.
            await queryRunner.commitTransaction();
            return { show };
        } catch (error) {
            await queryRunner.rollbackTransaction(); // 오류나면 모든 변경사항을 취소한다.
        } finally {
            await queryRunner.release(); // 트랜잭션의 성공여부와 관계없이 마지막에 항상 실행되며 사용된 DB를 해제한다.
        }
        }

    
    // 쇼 하나 조회
    async getShowInfo(showId: number){
        const show = await this.showRepository
        .createQueryBuilder('show')
        .leftJoinAndSelect('show.schedule', 'schedule')
        .where({ id: showId})
        .getOne()


        return { show } 
    }

    // 모든 쇼 조회
    async getAllShowInfo() {
        const shows = await this.showRepository.find()

        return shows
    }

    // 페이지 네이션
    async paginateShows(dto: PaginateShowDto){
        const shows = await this.showRepository.find({
            where:{
                id: MoreThan(dto.where__id_more_than ?? 0),
            },
            order:{
                createdAt: dto.order__createdAt,
            },
            take: dto.take,
        })


        return {
            data: shows
        }
    }

    // 해당 쇼 특정 시간 좌석 조회
    async findOneSeats(showId: number, user: any, scheduleId: any) {
        console.log('user:', user)
        console.log('scheduleId: ', scheduleId);

        const show = await this.showRepository
            .createQueryBuilder('show')
            .leftJoinAndSelect('show.schedule', 'schedule')
            .where( { id: showId })
            .getOne();
        console.log('show', show);

        const limits = await this.scheduleRepository.findOne({
            where: { id: showId },
            select: ['SClassLimit', 'AClassLimit', 'BClassLimit'],
        });
        console.log('limits: ', limits);

        const existSeats = await this.seatRepository.find({
            where: { schedules: scheduleId }
        });

        console.log('existsSeats: ', existSeats)
        
        
        // ---------------------------------------

        // 예매된 좌석 배열 초기화
        let bookedAClassSeatArr : Array<number> = [];
        let bookedBClassSeatArr : Array<number> = [];
        let bookedSClassSeatArr : Array<number> = [];

        // 좌석 db에 존재하는 seatNum을 각 grade에 맞게 새로운 배열로 변환
        for(const existseat of existSeats){
            if(existseat.grade === 'AClass'){
                bookedAClassSeatArr.push(existseat.seatNum);
            } else if (existseat.grade === 'BClass'){
                bookedBClassSeatArr.push(existseat.seatNum);
            } else if (existseat.grade === 'SClass'){
                bookedSClassSeatArr.push(existseat.seatNum);
            }
        }
        console.log('AClass 예매된 좌석 Arr', bookedAClassSeatArr);
        console.log('BClass 예매된 좌석 Arr', bookedBClassSeatArr);
        console.log('SClass 예매된 좌석 Arr', bookedSClassSeatArr);

        // 예매 가능한 좌석 배열 초기화
        let possibleAClassSeatArr : Array<any> = [];
        let possibleBClassSeatArr : Array<any> = [];
        let possibleSClassSeatArr : Array<any> = [];

        // 예매 가능 좌석 생성 class
        class SeatObject {
            grade: string;
            seatNum: number;
            price: number;

            constructor(grade: string, seatNum: number, price: number) {
                this.grade = grade;
                this.seatNum = seatNum;
                this.price = price;
            }
        }

        // AClass 예매 가능 좌석 생성
        for(let i = 0; i <= limits.AClassLimit; i++){
            const AClass = new SeatObject('AClass', i, show.price);
            possibleAClassSeatArr.push(AClass);
        }
        const filteredAClassSeats = possibleAClassSeatArr.filter((seat) => !bookedAClassSeatArr.includes(seat.seatNum),
        );

        // BClass 예매 가능 좌석 생성
        for(let i = 0; i <= limits.BClassLimit; i++){
            const BClass = new SeatObject('BClass', i, show.price);
            possibleBClassSeatArr.push(BClass);
        }
        const filteredBClassSeats = possibleBClassSeatArr.filter((seat) => !bookedBClassSeatArr.includes(seat.seatNum),
        );

        // SClass 예매 가능 좌석 생성
        for(let i = 0; i <= limits.SClassLimit; i++){
            const SClass = new SeatObject('SClass', i, show.price);
            possibleSClassSeatArr.push(SClass);
        }
        const filteredSClassSeats = possibleSClassSeatArr.filter((seat) => !bookedSClassSeatArr.includes(seat.seatNum),
        );

        console.log('AClass 예매 가능 좌석', filteredAClassSeats)
        console.log('AClass 예매 가능 좌석', filteredBClassSeats)
        console.log('AClass 예매 가능 좌석', filteredSClassSeats)

        return { filteredAClassSeats, filteredBClassSeats, filteredSClassSeats }
        };

    // 공연 수정
    async showUpdate(
        showId: number,
        updateShowDto: UpdateShowDto,
    ) {
        const existshow = await this.showRepository.findOne({
            where: { id: showId },
        });

        if(!existshow) {
            throw new NotFoundException('존재하지 않은 데이터입니다.');
        }

        const updateShow = await this.showRepository.update(
            existshow.id,
            updateShowDto,
        );

        return { updateShow } 
    }

    // 공연 삭제
    async deleteShow(showId: number){
        const show = await this.showRepository.findOne({
            where: {
                id: showId
            }
        });


        if(!show){
            throw new BadRequestException(
                '존재하지 않는 쇼입니다.'
            )
        }

        await this.showRepository.softDelete(show.id);

        return { message: '삭제 완료' } 
    }


    // 공연 검색(카테고리별)
    async search(keyword: string) {
        const searchValue = await this.showRepository.findOne({
            where: { 
                title: Like(`%${keyword}%`),
             },
        });

        return searchValue
    }

    
    async checkShowExistById(id: number) {
        return this.showRepository.exists({
            where:{
                id,
            },
        })
    }
}
