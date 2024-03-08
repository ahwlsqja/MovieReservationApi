import { IsDate, IsEnum, IsNotEmpty, IsString } from 'class-validator'
import { Category } from '../types/category.type';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { Show } from '../entities/show.entity';

export class CreateShowDto extends PickType(Show, ['title', 'showDate', 'location', 'image', 'category']) {}