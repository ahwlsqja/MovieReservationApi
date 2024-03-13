import { BaseModel } from "src/common/entity/base.entity";
import { Point } from "src/points/entities/point.entity";
import { Schedule } from "src/schedule/entities/schedule.entity";
import { Seat } from "src/seats/entities/seat.entity";
import { Show } from "src/shows/entities/show.entity";
import { UsersModel } from "src/users/entities/users.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({
    name: 'reservation',
  })
  export class Reservation extends BaseModel{
  
    @ManyToOne(() => UsersModel, (user) => user.reservation, {
      nullable: false,
      onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'userId', referencedColumnName: 'id'})
    user: UsersModel;
  
    @ManyToOne(() => Show, (show) => show.reservation, {
      nullable: false,
    })
    @JoinColumn({ name: 'showId' })
    show: Show;
  
    @OneToMany(() => Seat, (seat) => seat.reservation)
    seat: Seat[];
  
    @OneToMany(() => Point, (point) => point.reservation)
    point: Point[];
  
    @ManyToOne(() => Schedule, (schedule) => schedule.reservation, {
      nullable: false,
      onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'ScheduleId' , referencedColumnName: 'id'})
    schedule: Schedule;
  
    @Column({ default: true })
    status: boolean;
  
  }