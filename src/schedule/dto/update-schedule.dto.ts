import { PartialType } from '@nestjs/swagger';
import { CreateScheduleDto } from './create-schedule.dto';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class UpdateScheduleDto extends PartialType(CreateScheduleDto) {
  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  AClassLimit?: number;

  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  BClassLimit?: number;

  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  SClassLimit?: number;
}
