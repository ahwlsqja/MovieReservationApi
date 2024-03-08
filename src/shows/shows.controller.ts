import { Body, Controller, Get, NotFoundException, Param, Post } from '@nestjs/common';
import { ShowsService } from './shows.service';
import { ApiOperation } from '@nestjs/swagger';
import { CreateShowDto } from './dto/show.create.dto';

@Controller('shows')
export class ShowsController {
  constructor(private readonly showsService: ShowsService) {}

  
  @ApiOperation({ summary: '티켓 확인' })
  @Post()
  async create(@Body() createShowDto: CreateShowDto) {
    const show = await this.showsService.createShow(
      createShowDto.title,
      createShowDto.showDate,
      createShowDto.location,
      createShowDto.image,
      createShowDto.category,
    )
    return show;
  }
  
}
