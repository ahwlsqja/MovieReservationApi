import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Show } from '../entities/show.entity';
import { PickType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { Category } from '../types/category.type';

export class CreateShowDto {
    @IsNotEmpty({ message: '공연 이름을 입력해주세요.' })
    @ApiProperty({
      example: '뮤지컬 〈스모크〉',
      description: '쇼 이름',
      required: true,
    })
    title: string;
  
    @IsEnum(Category)
    category: Category;
  
    @IsNotEmpty({ message: '관람연령을 입력해주세요.' })
    @ApiProperty({
      example: 19,
      description: '관람 연령',
      required: true,
    })
    age: number;
  
    @IsNotEmpty({ message: '공연 가격을 입력해주세요.' })
    @ApiProperty({
      example: 20000,
      description: '공연 가격',
      required: true,
    })
    price: number;
  
    @IsNotEmpty({ message: '이미지 주소를 입력해주세요' })
    @ApiProperty({
      example:
        'https://ticketimage.interpark.com/Play/image/large/23/23013928_p.gif',
      description: '이미지 주소',
      required: true,
    })
    imageUrl: string;
  
    @IsNotEmpty({ message: '관람 시간을 입력해주세요' })
    @ApiProperty({
      example: 120,
      description: '관람 시간',
      required: true,
    })
    hours: number;
  
    @IsNotEmpty({ message: '장소를 입력해주세요' })
    @ApiProperty({
      example: '링크아트센터 벅스홀',
      description: '장소',
      required: true,
    })
    location: string;
  
    @IsNotEmpty({ message: '시작일을 입력해주세요.' })
    @ApiProperty({
      example: '2024-02-01',
      description: '시작일',
      required: true,
    })
    startDate: string;
  
    @IsNotEmpty({ message: '종료일을 입력해주세요.' })
    @ApiProperty({
      example: '2024-02-14',
      description: '종료일',
      required: true,
    })
    endDate: string;
}



