import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { UsersModel } from './users/entities/users.entity';
import { ReservationsModule } from './reservations/reservations.module';
import { ShowsModule } from './shows/shows.module';
import { SeatsModule } from './seats/seats.module';
import { Seat } from './seats/entities/seat.entity';
import { Show } from './shows/entities/show.entity';
import { Reservation } from './reservations/entities/reservation.entity';
import { CommonModule } from './common/common.module';
import { PointsModule } from './points/points.module';
import { Point } from './points/entities/point.entity';
import { ConfigModule } from '@nestjs/config';
import { ENV_DB_DATABASE_KEY, ENV_DB_HOST_KEY, ENV_DB_PASSWORD_KEY, ENV_DB_PORT_KEY, ENV_DB_USERNAME_KEY } from './common/const/env-keys.const';
import { ServeStaticModule } from '@nestjs/serve-static';
import { PUBLIC_FOLDER_PATH } from './common/const/path.const';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './users/guard/roles.guard';
import { AccessTokenGuard } from './auth/guard/bearer-token.guard';
import { ScheduleModule } from './schedule/schedule.module';
import { Schedule } from './schedule/entities/schedule.entity';



@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: PUBLIC_FOLDER_PATH,
      serveRoot: '/public'
    }),
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env[ENV_DB_HOST_KEY],
      port: parseInt(process.env[ENV_DB_PORT_KEY]),
      username: process.env[ENV_DB_USERNAME_KEY],
      password: process.env[ENV_DB_PASSWORD_KEY],
      database: process.env[ENV_DB_DATABASE_KEY],
      entities: [
        UsersModel,
        Show,
        Seat,
        Reservation,
        Point,
        Schedule,
      ],
      synchronize: true,
      logging: true,
    }),
    AuthModule,
    UsersModule,
    ReservationsModule,
    ShowsModule,
    SeatsModule,
    CommonModule,
    PointsModule,
    ScheduleModule,
  ],
  controllers: [AppController],
  providers: [AppService, 
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard,
    },
    {
    provide: APP_GUARD,
    useClass: RolesGuard,
  }
],
})
export class AppModule {}
