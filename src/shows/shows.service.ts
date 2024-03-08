import _ from 'lodash';
import { parse } from 'papaparse';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Show } from './entities/show.entity';
import { Category } from './types/category.type';
import { CreateShowDto } from './dto/show.create.dto';

@Injectable()
export class ShowsService {
    constructor(
        @InjectRepository(Show)
        private readonly showRepository: Repository<Show>
    ){}

    async createShow(userId: number, createShowDto : CreateShowDto){
        await this.showRepository.save({
            user: {
                id: userId,
            },
            ...createShowDto
        });
    }
}
