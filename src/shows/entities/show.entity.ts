import { Reservation } from "src/reservations/entities/reservation.entity";
import { Seat } from "src/seats/entities/seat.entity";
import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Category } from "../types/category.type";
import { IsDate, IsEnum, IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

@Entity({
    name: 'shows',
})
export class Show {
    @PrimaryGeneratedColumn()
    id: number;


    // 쇼 제목 
    @Column('varchar', { name: 'title', nullable: false })
    @IsString({
        message: 'title은 string 타입을 입력해주세요.'
      })
    @ApiProperty({
        example: '맘마마아',
        description: '쇼 제목',
      })
    @IsNotEmpty({ message: '제목을 입력해주세요.' })
    title: string;


    // 쇼 날짜
    @Column('date', { name: 'showDate', nullable: false })
    @IsDate({
        message: 'showDate은 Date 타입을 입력해주세요.'
      })
    @IsNotEmpty({ message: '날짜를 입력해주세요.' })
    showDate: Date;

    
    // 쇼 장소
    @Column('varchar', { name: 'location', nullable: false })
    @IsString({
        message: 'location은 string 타입을 입력해주세요.'
      })
      @ApiProperty({
          example: '시드니',
          description: '쇼 장소',
        })
      @IsNotEmpty({ message: '장소를 입력해주세요.' })
    location: string;


    // 쇼 이미지
    @Column('varchar', { name: 'image', nullable: false})
    @IsString({
        message: 'image은 string 타입을 입력해주세요.'
      })
      @ApiProperty({
          example: '맘마미아 이미지',
          description: '쇼 이미지',
        })
      @IsNotEmpty({ message: '이미지를 입력해주세요.' })
    image: string;


    // 쇼 카테고리
    @Column('enum', { name: 'category', enum: Category, nullable: false})
    @IsEnum(Category)
    @ApiProperty({
        example: Category.ACTION,
        description: '쇼 카테고리',
      })
    @IsNotEmpty({ message: '종류를 입력해주세요.' })
    category: Category;

    @OneToMany(() => Seat, (seat) => seat.show)
    seat: Seat

    @OneToMany(() => Reservation, (reservation) => reservation.show)
    reservation: Reservation[]
}

