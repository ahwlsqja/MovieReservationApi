import { BaseModel } from "src/common/entity/base.entity";
import { Reservation } from "src/reservations/entities/reservation.entity";
import { Schedule } from "src/schedule/entities/schedule.entity";
import { Show } from "src/shows/entities/show.entity";
import { UsersModel } from "src/users/entities/users.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Grade } from "../const/grade-enum";

@Entity({
    name: 'seats',
})
export class Seat extends BaseModel{

    @Column({ type: 'enum', enum: Grade })
    grade: Grade;

    @Column('int', { name: 'seatNum', nullable: false})
    seatNum: number

    @Column('int', { name: 'seatPrice', nullable: false })
    seatPrice: number;


    @ManyToOne(() => Show, (show) => show.seat, {
        onDelete: 'CASCADE',
        nullable: false,
    })
    @JoinColumn([{ name: 'showId', referencedColumnName: 'id' }])
    show: Show;

    @ManyToOne(() => UsersModel, (user) => user.seat, {
        nullable: false,
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'userId', referencedColumnName: 'id'})
    user: UsersModel;


    @ManyToOne(() => Reservation, (reservation) => reservation.seat, {
        nullable: false,
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'reservationId', referencedColumnName: 'id'})
    reservation: Reservation;

    @ManyToOne(() => Schedule, (schedule) => schedule.seats,{
        nullable: false,
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'scheduleId', referencedColumnName: 'id'})
    schedules: Schedule;
}
