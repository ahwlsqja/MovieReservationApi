import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateReservationDto {}

export class SeatDto {
    @IsNotEmpty({ message : '좌석 등급을 선택해주세요.'})
    @ApiProperty({
        example: 'SClass',
        description: '좌석 등급',
        required: true,
    })
    grade: string;

    @IsNotEmpty({ message: '좌석을 선택 해주세요'})
    @ApiProperty({
        example: 10,
        description: '좌석 번호',
        required: true,
    })
    seatNum: number;
}

export class SetSeatDto{
    seats: SeatDto[];

    @IsNotEmpty({ message: '공연을 선택 해 주세요.'})
    @ApiProperty({
        example: 13,
        description: '스케줄 ID',
        required: true,
    })
    scheduleId: number;
}