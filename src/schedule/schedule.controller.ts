import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/users/decorator/roles.decorator';
import { RolesEnum } from 'src/users/const/roles.const';

@ApiTags('SCHEDULES')
@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}


  // 스케줄 등록
  @ApiOperation({ summary: '스케줄 등록' })
  @ApiQuery({
    name: 'showId',
    required: true,
    description: '공연 ID',
  })
  @ApiResponse({
    status: 200,
    description: '스케줄 등록 성공',
  })
  @ApiResponse({
    status: 400,
    description: '스케줄 등록 실패',
  })
  @Roles(RolesEnum.ADMIN) // 관리자 권한 인증 
  @Post('/:showId')
  create(
    @Body() createScheduleDto: CreateScheduleDto,
    @Body() playDate: Date,
    @Param('showId') showId: string,
    ) {
    return this.scheduleService.create(
      createScheduleDto,
      showId,
      playDate,
      );
  }

  // 스케줄 목록 조회
  @ApiOperation({ summary: '스케줄 목록 조회' })
  @ApiResponse({
    status: 200,
    description: '스케줄 목록 조회 성공',
    type: 'CreateScheduleDto'
  })
  @ApiResponse({
    status: 404,
    description: '스케줄 목록 조회 실패',
  })
  @Get()
  findAll() {
    return this.scheduleService.findAll();
  }

  // 스케줄 상세 조회
  @ApiOperation({ summary: '스케줄 상세 조회'})
  @ApiResponse({
    status: 200,
    description: '스케줄 상세 조회 성공',
    type: 'CreateScheduleDto',
  })
  @ApiResponse({
    status: 404,
    description: '스케줄 상세 조회 실패',
  })
  @ApiQuery({
    name: 'showId',
    description: '쇼 Id',
    required: true,
  })
  @Get(':showId')
  findOne(@Param('showId') showId: string) {
    return this.scheduleService.findOne(+showId);
  }

  // 스케줄 수정
  @ApiOperation({ summary: '스케줄 수정'})
  @ApiResponse({
    status: 200,
    description: '스케줄 수정 성공'
  })
  @ApiResponse({
    status: 404,
    description: '스케줄 수정 실패',
  })
  @ApiQuery({
    name: 'scheduleId',
    required: true,
    description: '스케줄 Id',
  })
  @Roles(RolesEnum.ADMIN) // 관리자 권한 인증 
  @Patch(':id')
  update(@Param('id') id: string, 
  @Body() updateScheduleDto: UpdateScheduleDto) {
    return this.scheduleService.updateSchedule(updateScheduleDto, id);
  }

  // 스케줄 취소
  @ApiOperation({ summary: '스케줄 삭제' })
  @ApiResponse({
    status: 200,
    description: '스케줄 삭제 성공',
  })
  @ApiResponse({
    status: 404,
    description: '스케줄 삭제 실패',
  })
  @ApiQuery({
    name: 'showId',
    description:'공연 ID',
    required : true,
  })
  @Roles(RolesEnum.ADMIN) // 관리자 권한 인증 
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.scheduleService.remove(+id);
  }
}
