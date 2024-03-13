import { BaseModel } from "src/common/entity/base.entity";
import { Reservation } from "src/reservations/entities/reservation.entity";
import { Seat } from "src/seats/entities/seat.entity";
import { Show } from "src/shows/entities/show.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, Timestamp } from "typeorm";

@Entity({
    name: 'schedule'
})
export class Schedule extends BaseModel{
    @ManyToOne(() => Show, (show) => show.schedule, {
        nullable: false,
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'showId', referencedColumnName: 'id'})
    show: Show;

    @Column({ type: 'timestamp', name: 'start_time', nullable: false })
    startTime: Timestamp;

    @Column({ type: 'timestamp', name: 'end_time', nullable: false})
    endTime: Timestamp;

    @Column({ type: 'int', name: 'AClassLimit', nullable: false})
    AClassLimit: number;

    @Column({ type: 'int', name: 'BClassLimit', nullable: false})
    BClassLimit: number;

    @Column({ type: 'int', name: 'SClassLimit', nullable: false})
    SClassLimit: number;

    @OneToMany(() => Reservation, (reservation) => reservation.schedule)
    reservation: Reservation[];

    @OneToMany(() => Seat, (seat) => seat.schedules)
    seats: Seat[];
     
}
 