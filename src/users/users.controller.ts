import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getUsers(){
    return this.usersService.getAllUsers();
  }

  // @Post()
  // postUser(@Body('name') name: string,
  //     @Body('email') email: string,
  //     @Body('password') password: string) {
  //       return this.usersService.createUser({
  //         name, email, password});
  //     }
}
