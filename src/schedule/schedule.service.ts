import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Schedule } from './entities/schedule.entity';
import { Repository } from 'typeorm';
import { Show } from 'src/shows/entities/show.entity';
import { NotFoundError, retry } from 'rxjs';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Schedule>,
    @InjectRepository(Show)
    private showRepository: Repository<Show>,
  ) {}

  // 공연 시간표 등록
  async create(
    createScheduleDto: CreateScheduleDto,
    showId: string,
    playDate: any,
    ) {
      console.log(showId)
      console.log('공연 시간표 등록 날짜', playDate.playDate);
      const { startTime, endTime, AClassLimit, BClassLimit, SClassLimit } = createScheduleDto;
      const findStartTime: any = `${playDate.playDate} ${startTime}`;
      const findEndTime: any = `${playDate.playDate} ${endTime}`;
      try{
        console.log(1)
        const existTime = await this.scheduleRepository.findOne({
          where: {
            startTime: findStartTime,
            endTime: findEndTime,
          },
        });
        if(existTime) {
          throw new Error('이미 존재하는 타임입니다.')
        }
        console.log(2)
        const check = await this.showRepository.findOne({
          where: { id: +showId },
        });
        console.log(3)

        if(!check) new NotFoundException('데이터 조회 실패');

        const showTime = await this.scheduleRepository.save({
          show: { id: +showId },
          startTime: `${playDate.playDate} ${startTime}`,
          endTime: `${playDate.playDate} ${endTime}`,
          AClassLimit,
          BClassLimit,
          SClassLimit,
        });

        return { showTime };
      }catch(error) {
        console.error(error);
        return { status: 400, message: '오류 발생' };
      }
    }


    // 스케줄 전체 조회
    async findAll() {
      return await this.scheduleRepository.find();
    }

    // 스케줄 상세 조회
    async findOne(showId: any) {
      const scheduleDetail = await this.showRepository.findOne({
        where: { id: showId },
        relations: {
          schedule: true,
        }
      });

      return scheduleDetail;
    }

    // 스케줄 업데이트
    async updateSchedule(updateScheduleDto: UpdateScheduleDto, id: string) {
      try{
        console.log('스케줄 아이디', id);
        const updatedSchedule = await this.scheduleRepository.update(
          id,
          updateScheduleDto,
        );

        return { updatedSchedule } ;
      } catch (error) {
        console.error(error);
      }
    }
    async remove(id: number){
      await this.scheduleRepository.delete(id);
      return { message: '스케줄이 성공적으로 취소되었습니다.'}
    }

}
