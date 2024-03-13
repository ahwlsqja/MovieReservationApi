import { Reservation } from "src/reservations/entities/reservation.entity";
import { Seat } from "src/seats/entities/seat.entity";
import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Category } from "../types/category.type";
import { IsDate, IsEnum, IsInt, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { BaseModel } from "src/common/entity/base.entity";
import { Transform } from "class-transformer";
import { join } from "path";
import { SHOW_PUBLIC_IMAGE_PATH } from "src/common/const/path.const";
import { ImageModel } from "src/common/entity/image.entity";
import { Schedule } from "src/schedule/entities/schedule.entity";

@Entity({
    name: 'show',
})
export class Show extends BaseModel{

    // 쇼 제목 
    @Column('varchar', { name: 'title', nullable: false })
    @IsString({
        message: 'title은 string 타입을 입력해주세요.'
      })
    title: string;

    // 쇼 장소
    @Column('varchar', { name: 'location', nullable: false })
    @IsString({
        message: 'location은 string 타입을 입력해주세요.'
      })
    location: string;

    @Column('int', { name: 'age', nullable: false })
    @IsInt({
      message: 'location은 Int 타입을 입력해주세요.'
      })
    age: number

    // 쇼 카테고리
    @Column('enum', { name: 'category', enum: Category, nullable: false})
    @IsEnum(Category)
    @IsNotEmpty({ message: '종류를 입력해주세요.' })
    category: Category;
    
    // 쇼 시작 날짜
    @Column('varchar', { name: 'startDate', nullable: false})
    startDate: string;

    // 쇼 종료 날짜
    @Column('varchar', { name: 'endDate', nullable: false})
    endDate : string;
    
    // 쇼 가격
    @Column('int', { name: 'price', nullable: false})
    price: number;
    
    // 이미지 url
    @Column('varchar', { name : 'imageUrl', nullable: false})
    imageUrl: string;
    
    // 쇼 시간
    @Column('int', { name:'hours', nullable: false})
    hours: number;
    
    @OneToMany(() => Seat, (seat) => seat.show)
    seat: Seat

    @OneToMany(() => Reservation, (reservation) => reservation.show)
    reservation: Reservation[]

    @OneToMany(() => Schedule, (schedule) => schedule.show)
    schedule: Schedule[]
}

