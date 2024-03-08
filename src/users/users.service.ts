import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersModel } from './entities/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UsersModel)
        private readonly usersRepository: Repository<UsersModel>
    ){}

    async createUser(user: Pick<UsersModel,'name'|'email'|'password'>){
        const nameExists = await this.usersRepository.exists({
            where:{
                name: user.name,
            }
        })

        if(nameExists){
            throw new BadRequestException('이미 존재하는 이름입니다.')
        }

        const emailExists = await this.usersRepository.exists({
            where: {
                email: user.email,
            }}
        );


        if(emailExists){
            throw new BadRequestException('이미 존재하는 이메일 입니다.')
        }


        const userObject = this.usersRepository.create({
            name: user.name,
            email: user.email,
            password: user.password,
        });

        const newUser = await this.usersRepository.save(userObject);

        return newUser;
    }

    async getAllUsers(){
        return this.usersRepository.find();
    }

    async getUserByEmail(email: string){
        return this.usersRepository.findOne({
            where:{
                email,
            },
        })
    }
}
