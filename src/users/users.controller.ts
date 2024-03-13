import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { Roles } from './decorator/roles.decorator';
import { RolesEnum } from './const/roles.const';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('USER')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // 모든 사용자 조회(매니저만 가능)
  @ApiOperation({ summary: '모든 사용자 조회'})
  @Get()
  @Roles(RolesEnum.ADMIN)
  getUsers(){
    return this.usersService.getAllUsers();
  }





// 유저 정보 조회
@ApiOperation({ summary: '유저 정보 조회' })
@ApiResponse({
  status: 200,
  description: '조회 성공',
})
@ApiResponse({
  status: 401,
  description: '조회 실패',
})
@ApiResponse({
  status: 404,
  description: '조회 할 목록이 없습니다.',
})
@ApiQuery({
  name: 'userId',
  required: true,
  description: '사용자 ID',
})
@Get(':userId')
findOne(@Param('userId') userId: string) {
  const user = this.usersService.getUser(userId);
  return user;
}

// 유저 포인트 조회
@Get('point/:userId')
getUserPoint(@Param('userId') userId: string) {
  const user = this.usersService.getUserPoint(userId);
  return user;
}
}
