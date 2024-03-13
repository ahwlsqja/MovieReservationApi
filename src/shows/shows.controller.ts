import { Body, Controller, Delete, Get, InternalServerErrorException, NotFoundException, Param, ParseIntPipe, Patch, Post, Query, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { ShowsService } from './shows.service';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { CreateShowDto } from './dto/show.create.dto';
import { User } from 'src/users/decorator/user.decorator';
import { UpdateShowDto } from './dto/show.update.dto';

import { RolesEnum } from 'src/users/const/roles.const';
import { PaginateShowDto } from './dto/paginte-show.dto';
import { query } from 'express';
import { AccessTokenGuard } from 'src/auth/guard/bearer-token.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageModel, ImageModelType } from 'src/common/entity/image.entity';
import { DataSource, QueryRunner as QR } from 'typeorm';
import { TransactionInterceptor } from 'src/common/interceptor/transaction.interceptor';
import { QueryRunner } from 'src/common/decorater/query-runner.decorator';
import { Roles } from 'src/users/decorator/roles.decorator';
import { IsPublic } from 'src/common/decorater/is-public.decorator';
import { CreateScheduleDto } from 'src/schedule/dto/create-schedule.dto';
import { UsersModel } from 'src/users/entities/users.entity';

@Controller('show')
export class ShowsController {
  constructor(private readonly showsService: ShowsService,
              private readonly dataSource: DataSource,
              ) {}

  // 공연 등록 
  @Roles(RolesEnum.ADMIN) // 관리자 권한 인증 
  @ApiOperation({ summary: '티켓 확인' })
  @ApiResponse({
    status: 401,
    description: '권한이 없습니다.'
  })
  @Post()
  async create(
    @Body() 
    createShowDto: CreateShowDto,
    @Body()
    createScheduleDto :CreateScheduleDto, // startTime이 '18:00', endTime이 '20:00'
    @Body()
    playDate: Date, // 공연 시작 날짜받는거다 이를테면 '2024-03-20' 이렇게
    ) {
      return await this.showsService.createShow(
        createShowDto,
        createScheduleDto,
        playDate,
      );
  }

  // 공연 검색
  @ApiOperation({ summary: '공연 검색'})
  @ApiResponse({
    status: 200,
    description: '공연 검색 성공',
  })
  @ApiResponse({
    status: 200,
    description: '공연이 존재하지 않습니다.',
  })
  @ApiQuery({
    name: 'search',
    description: '검색어',
    required: true,
  })
  @Get('search')
  @IsPublic()
  searchShow(@Query('keyword') keyword: string) {
    return this.showsService.search(keyword); 
  }
  
  // 공연 전체 조회
  @ApiOperation({ summary: '공연 전체 조회' })
  @ApiResponse({
    status: 200,
    description: '공연 목록 조회 성공',
  })
  @ApiResponse({
    status : 404,
    description: '공연이 존재하지 않습니다.',
  })
  @Get()
  findAll() {
    return this.showsService.getAllShowInfo();
  }

  
  // 모든 공연 조회
  @Get()
  @IsPublic()
  async getAllShowInfo(
    @Query() query: PaginateShowDto,
  ){
    return await this.showsService.paginateShows(query);
  }

  // 해당 공연 좌석 조회
  @ApiOperation({ summary: '해당 공연 좌석 조회' })
  @ApiResponse({
    status: 200,
    description: '해당 공연 좌석 조회 성공',
  })
  @ApiResponse({
    status: 404,
    description: '좌석 정보가 존재하지 않습니다.',
  })
  @ApiQuery({
    name: 'showId',
    description: '공연 ID',
    required: true,
  })
  @ApiQuery({
    name :'scheduleId',
    description: '스케줄 ID',
    required: true,
  })
  @Get(':showId/seat/:scheduleId')
  findOneSeats(
    @User() user: UsersModel,
    @Param('showId') showId: string,
    @Param('scheduleId') scheduleId: string,
  ) {
    return this.showsService.findOneSeats(
      +showId,
      user,
      +scheduleId,
    );
  }

  // 공연 상세 조회
  @ApiOperation({ summary: '공연 상세 조회' })
  @ApiResponse({
    status: 200,
    description : '공연 상세 조회 성공',
  })
  @ApiResponse({
    status: 404,
    description: '공연이 존재하지 않습니다.',
  })
  @ApiQuery({
    name: 'showId',
    description: '공연 Id',
    required: true,
  })
  @Get(':showId')
  findOne(@Param('showId') showId: string) {
    return this.showsService.getShowInfo(+showId)
  }

  // 공연 수정
  @ApiOperation({ summary: '공연 수정'})
  @ApiResponse({
    status: 200,
    description: '공연 수정 성공',
    type: UpdateShowDto,
  })
  @ApiResponse({
    status: 401,
    description: '권한이 없습니다.',
  })
  @ApiQuery({
    name: 'showId',
    description: '공연 Id',
    required: true,
  })
  @Roles(RolesEnum.ADMIN) // 관리자 권한 인증 
  @Patch(':showId')
  async updateShow(
    @Param('showId', ParseIntPipe) showId: number,
    @Body() updateShowDto: UpdateShowDto,
  ){
    return this.showsService.showUpdate(
      showId, updateShowDto,
    );
  }


  // 특정 공연 삭제
  @ApiOperation({ summary: '공연 삭제'})
  @ApiResponse({
    status : 200,
    description : '공연 삭제 성공',
  })
  @ApiResponse({
    status: 401,
    description: '권한이 없습니다.',
  })
  @ApiQuery({
    name: 'showId',
    description: '쇼 ID',
    required: true,
  })
  @Roles(RolesEnum.ADMIN) // 관리자 권한 인증 
  @Delete(':id')
  deleteShow(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.showsService.deleteShow(id);
  }
}
