import { Reservation } from "src/reservations/entities/reservation.entity";
import { Show } from "src/shows/entities/show.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({
    name: 'seats',
})
export class Seat {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('int', { name: 'showId'})
    showId: number;
    
    @Column('int', { name: 'userId', nullable: false})
    seatNumber: number

    @Column('int', { name: 'price', nullable: false })
    price: number;

    @ManyToOne(() => Show, (show) => show.seat, {
        onDelete: 'CASCADE',
    })
    @JoinColumn([{ name: 'showId', referencedColumnName: 'id' }])
    show: Show;

    @OneToMany(() => Reservation, (reservation) => reservation.seat)
    reservation: Reservation
}
