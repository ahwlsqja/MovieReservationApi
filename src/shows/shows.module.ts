import { BadRequestException, Module } from '@nestjs/common';
import { ShowsService } from './shows.service';
import { ShowsController } from './shows.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Show } from './entities/show.entity';
import { MulterModule } from '@nestjs/platform-express';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { CommonModule } from 'src/common/common.module';
import { extname } from 'path';
import multer from 'multer';
import { SHOWS_IMAGE_PATH } from 'src/common/const/path.const';
import { v4 as uuid } from 'uuid'
import { ImageModel } from 'src/common/entity/image.entity';
import { Schedule } from 'src/schedule/entities/schedule.entity';
import { Seat } from 'src/seats/entities/seat.entity';
import { DataSource } from 'typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Show,
  Schedule,
  Seat]),
],
  controllers: [ShowsController],
  providers: [ShowsService],
  exports: [ShowsService]
})
export class ShowsModule {}
