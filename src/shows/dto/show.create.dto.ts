import { IsDate, IsEnum, IsNotEmpty, IsString } from 'class-validator'
import { Category } from '../types/category.type';
import { ApiProperty } from '@nestjs/swagger';

export class CreateShowDto {
    @IsString()
    @ApiProperty({
        example: '맘마마아',
        description: '쇼 제목',
      })
    @IsNotEmpty({ message: '제목을 입력해주세요.' })
    title: string;

    @IsDate()
    @IsNotEmpty({ message: '날짜를 입력해주세요.' })
    showDate: Date;

    @IsString()
    @ApiProperty({
        example: '시드니',
        description: '쇼 장소',
      })
    @IsNotEmpty({ message: '장소를 입력해주세요.' })
    location: string;

    @IsString()
    @ApiProperty({
        example: '맘마미아 이미지',
        description: '쇼 이미지',
      })
    @IsNotEmpty({ message: '이미지를 입력해주세요.' })
    image: string;

    @IsEnum(Category)
    @ApiProperty({
        example: Category.ACTION,
        description: '쇼 카테고리',
      })
    @IsNotEmpty({ message: '종류를 입력해주세요.' })
    category: Category;

}