import { Controller, Get, Req } from '@nestjs/common';
import * as cookieParser from 'cookie-parser'
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(@Req() req): string {
    console.log(req.cookies);
    return this.appService.getHello();
  }
} 
