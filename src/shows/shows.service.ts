import _ from 'lodash';
import { parse } from 'papaparse';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Show } from './entities/show.entity';
import { Category } from './types/category.type';

@Injectable()
export class ShowsService {
    constructor(
        @InjectRepository(Show)
        private readonly showRepository: Repository<Show>
    ){}

    async createShow(title: string, showDate: Date, location: string, image: string, category: Category){
        await this.showRepository.save({
            title,
            showDate,
            location,
            image,
            category,
        });
    }
}
