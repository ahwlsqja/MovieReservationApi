import { BaseModel } from "src/common/entity/base.entity";
import { Reservation } from "src/reservations/entities/reservation.entity";
import { User } from "src/users/decorator/user.decorator";
import { UsersModel } from "src/users/entities/users.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";


@Entity({
    name: 'point'
})
export class Point extends BaseModel{

    // UserId
    @Column('int', { name: 'userId', nullable: false})
    userId: number

    @ManyToOne(() => UsersModel, (user)=> user.point, {
        onDelete: 'CASCADE'
    })
    @JoinColumn([{ name: 'userId', referencedColumnName: 'id' }])
    user: UsersModel

    @ManyToOne(() => Reservation, (reservation) => reservation.point, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'reservationId', referencedColumnName: 'id' })
    reservation: Reservation;

    @Column('int', { name: 'income', default: 1000000, nullable: false})
    income: number;

    @Column('int', { name: 'expense', default: 0, nullable: false})
    expense: number;

    @Column('int', { name: 'balance', default: 1000000, nullable: false})
    balance: number;
}


