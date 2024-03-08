import { Body, Controller, Get, NotFoundException, Param, Post } from '@nestjs/common';
import { ShowsService } from './shows.service';
import { ApiOperation } from '@nestjs/swagger';
import { CreateShowDto } from './dto/show.create.dto';
import { User } from 'src/users/decorator/user.decorator';

@Controller('shows')
export class ShowsController {
  constructor(private readonly showsService: ShowsService) {}

  
  @ApiOperation({ summary: '티켓 확인' })
  @Post()
  async create(
    @User('id') userId: number,
    @Body() createShowDto: CreateShowDto
    ) {
    const show = await this.showsService.createShow(
      userId, 
      createShowDto,
    )
    return show;
  }
  
}
