import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { RolesEnum } from "../const/roles.const";
import { Reservation } from "src/reservations/entities/reservation.entity";
import { IsEmail, IsString, Length, ValidationArguments } from "class-validator";
import { lengthValidationMessage } from "src/common/validation-message/length-validation.message";
import { stringValidationMessage } from "src/common/validation-message/string-validation.message";
import { emailValidationMessage } from "src/common/validation-message/email-validation.message";
import { BaseModel } from "src/common/entity/base.entity";
import { Point } from "src/points/entities/point.entity";
import { Seat } from "src/seats/entities/seat.entity";


@Entity({
    name: 'users',
})
export class UsersModel extends BaseModel{
    // 이름
    @Column({
        length: 10,
        nullable: false,
    })
    @IsString({
        message: stringValidationMessage
    })
    @Length(1, 20, {
        message: lengthValidationMessage,
    })
    name: string;
    
    // 이메일
    @Column({
        length: 50,
        nullable: false,
        unique: true
    })
    @IsString()
    @IsEmail({}, {
        message: emailValidationMessage
    })
    email: string;


    // 비밀번호
    @Column()
    @IsString()
    @Length(3, 8, {
        message: lengthValidationMessage,
    })
    password: string;

    // 관리자 인지 일반 유저인지
    @Column({
        enum: Object.values(RolesEnum),
        default: RolesEnum.USER,
    })
    role: RolesEnum;

    
    @OneToMany(() => Point, (point) => point.user)
    point: Point[]

    @OneToMany(() => Seat, (seat) => seat.user)
    seat: Seat;

    @OneToMany(() => Reservation, (reservation) => reservation.user)
    reservation: Reservation;
}