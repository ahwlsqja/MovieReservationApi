import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersModel } from './entities/users.entity';
import { DataSource, Repository } from 'typeorm';
import { Point } from 'src/points/entities/point.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UsersModel)
        private readonly usersRepository: Repository<UsersModel>,
        @InjectRepository(Point)
        private readonly pointsRepository: Repository<Point>,
        private readonly dataSource: DataSource,
    ){}
    
    // 유저 회원가입
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

        await this.pointsRepository.save({
            userId: newUser.id
        })
        
        return newUser;
    }


    // 모든 유저 조회
    async getAllUsers(){
        return this.usersRepository.find({
            relations: ['reservation'],
        });
    }

    // 이메일로 유저 조회
    async getUserByEmail(email: string) {
        return this.usersRepository.findOne({
            where: {
                email,
            },
        });
    }

    // 유저 상세 조회(포인트 조회)
    async getUser(userId: string){
        const user = await this.usersRepository
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.point','point')
            .select(['user.name', 'point.balance'])
            .where({ id: userId })
            .getOne();
            return user;
    }
        

    async getUserPoint(userId: string) {

        const points = await this.pointsRepository.find({
            where: { userId: +userId },
        });

        if (points.length > 0) {
            const lastPointBalance = points[points.length - 1].balance;
            return lastPointBalance;
        } else {
            return 0; 
        }
    }
    
}
