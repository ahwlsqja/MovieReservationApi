import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { AccessTokenGuard } from 'src/auth/guard/bearer-token.guard';
import { CreateReservationDto, SetSeatDto } from './dto/create.reservation.dto';
import { UsersModel } from 'src/users/entities/users.entity';
import { User } from 'src/users/decorator/user.decorator';
import { UpdatereservationDto } from './dto/update.reservation.dto';
import { IsReservationMineOrAdmin } from './guard/is-reservation-mine-orAdmin.guard';
import { TransactionInterceptor } from 'src/common/interceptor/transaction.interceptor';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { userInfo } from 'os';
import { throwIfEmpty } from 'rxjs';

@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}


  // 공연 예매
  @ApiOperation({ summary: '공연 예매'})
  @ApiQuery({
    name: 'value',
    description: '공연 ID',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: '예매 성공',
  })
  @ApiResponse({
    status: 400,
    description: '예매 실패',
  })
  @ApiResponse({
    status: 404,
    description: '존재하지 않는 공연 입니다.',
  })
  @Post('create')
  createReservation(
    @Body() setSeatDto : SetSeatDto,
    @User() user: UsersModel,
    @Query('showId') showId: string,
  ){
    const seat = setSeatDto.seats;
    const bodyScheduleId = setSeatDto.scheduleId;
    const id = user.id;
    return this.reservationsService.createReservation(
      seat,
      id,
      +showId,
      bodyScheduleId,
    )
  } 



 // 예매 목록 조회
 @ApiOperation({ summary: '예매 목록 조회' })
 @ApiResponse({
   status: 200,
   description: '예메 목록 조회 성공',
 })
 @ApiResponse({
   status: 404,
   description: '예메 목록 조회 실패',
 })
 @Get()
 findAll(
  @User() user: UsersModel) {
    return this.reservationsService.findAll(user)
  }



 // 예매 취소
 @ApiOperation({ summary: '예매 취소'})
 @ApiResponse({
  status : 200,
  description: '예매 취소 성공'
 })
 @ApiResponse({
  status: 404,
  description: '예매 취소 실패',
 })
 @Delete()
 cancle(
  @User() user: UsersModel,
  @Query('value') value: string) {
    return this.reservationsService.cancle(+value, user);
  }
}
