import { Seat } from "src/seats/entities/seat.entity";
import { Show } from "src/shows/entities/show.entity";
import { UsersModel } from "src/users/entities/users.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({
    name: 'reservations',
})
export class Reservation {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('int', { name: 'userId'})
    userId: number;

    @Column('int', { name: 'showId'})
    showId: number;

    @Column('int', { name: 'seatId'})
    seatId: number;

    @Column('date', { name:'reservationDate'})
    reservationDate: Date

    @ManyToOne(() => Show, (show) => show.reservation, {
        onDelete: 'CASCADE',
    })
    @JoinColumn([{ name: 'showId', referencedColumnName: 'id'}])
    show: Show;
    
    @ManyToOne(() => UsersModel, (user) => user.reservation, {
        onDelete: 'CASCADE',
    })
    @JoinColumn([{ name: 'userId', referencedColumnName: 'id'}])
    user: UsersModel;

    @ManyToOne(() => Seat, (seat) => seat.reservation, {
        onDelete: 'CASCADE',
    })
    @JoinColumn([{ name: 'seatId', referencedColumnName: 'id'}])
    seat: Seat;
}