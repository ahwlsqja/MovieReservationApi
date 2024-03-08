import { Column, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { RolesEnum } from "../const/roles.const";
import { Reservation } from "src/reservations/entities/reservation.entity";

export class UsersModel{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 10,
        nullable: false,
    })
    name: string;
    
    @Column({
        length: 20,
        nullable: false,
        unique: true
    })
    email: string;

    @Column()
    password: string;

    @Column()
    point: number;

    @Column({
        enum: Object.values(RolesEnum),
        default: RolesEnum.USER,
    })
    role: RolesEnum;

    @OneToMany(() => Reservation, (reservation) => reservation.user)
    reservation: Reservation[]
}