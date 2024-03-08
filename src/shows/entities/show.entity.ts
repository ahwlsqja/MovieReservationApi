import { Reservation } from "src/reservations/entities/reservation.entity";
import { Seat } from "src/seats/entities/seat.entity";
import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Category } from "../types/category.type";

@Entity({
    name: 'shows',
})
export class Show {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('string', { name: 'title', nullable: false })
    title: string;

    @Column('date', { name: 'showDate', nullable: false })
    showDate: Date;

    @Column('string', { name: 'location', nullable: false })
    location: string;

    @Column('string', { name: 'image', nullable: false})
    image: string;

    @Column('enum', { name: 'category', enum: Category, nullable: false})
    category: Category;

    @OneToMany(() => Seat, (seat) => seat.show)
    seat: Seat

    @OneToMany(() => Reservation, (reservation) => reservation.show)
    reservation: Reservation[]
}


// title, showDate, location, showImage, showCatagory