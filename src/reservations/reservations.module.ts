import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from './entities/reservation.entity';
import { CommonModule } from 'src/common/common.module';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModel } from 'src/users/entities/users.entity';
import { UsersModule } from 'src/users/users.module';
// import { ShowExistMiddleware } from './middleware/show-exists.middleware';
import { ShowsModule } from 'src/shows/shows.module';
import { Schedule } from 'src/schedule/entities/schedule.entity';
import { Show } from 'src/shows/entities/show.entity';
import { Point } from 'src/points/entities/point.entity';
import { Seat } from 'src/seats/entities/seat.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Reservation, Schedule, Show, Point, Seat]),
  ],
  controllers: [ReservationsController],
  providers: [ReservationsService],
})
export class ReservationsModule {}
