import { ApiProperty } from '@nestjs/swagger';
import { instanceToInstance } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class CreateScheduleDto {
  @IsNotEmpty({ message: '공연 시작 시각을 입력해주세요.' })
  @ApiProperty({
    example: '15:00:00',
    description: '공연 시작 시각',
    required: true,
  })
  startTime: string;

  @IsNotEmpty({ message: '공연 종료 시각을 입력해주세요.' })
  @ApiProperty({
    example: '17:00:00',
    description: '공연 종료 시각',
    required: true,
  })
  endTime: string;

  @IsNotEmpty({ message: 'AClass석 좌석수를 입력해주세요.' })
  @ApiProperty({
    example: 100,
    description: 'STANDARD석 좌석 수',
    required: true,
  })
  AClassLimit: number;

  @IsNotEmpty({ message: 'BClass석 좌석수를 입력해주세요.' })
  @ApiProperty({
    example: 100,
    description: 'ROYAL석 좌석 수',
    required: true,
  })
  BClassLimit: number;

  @IsNotEmpty({ message: 'SClass석 좌석수를 입력해주세요.' })
  @ApiProperty({
    example: 100,
    description: 'VIP석 좌석 수',
    required: true,
  })
  SClassLimit: number;
}
