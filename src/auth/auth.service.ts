import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { HASH_ROUNDS, JWT_SECRET } from './const/auth.const';
import { UsersModel } from 'src/users/entities/users.entity';
import bcrypt from "bcrypt"

@Injectable()
export class AuthService {
    usersService: any;
    constructor(
        private readonly jwtService: JwtService,
    ){}
    

    signToken(user: Pick<UsersModel, 'email' | 'id'>, isRefreshToken: boolean){
        const payload = {
            email: user.email,
            sub: user.id,
            type: isRefreshToken ? 'refresh' : 'access',
        };


        return this.jwtService.sign(payload, {
            secret: JWT_SECRET,
            expiresIn: isRefreshToken ? 3600: 300,
        })
    }


    loginUser(user: Pick<UsersModel, 'email'|'id'>){
        return {
            accessToken: this.signToken(user, false),
            refreshToken: this.signToken(user, true),
        }
    }


    extractTokenFromHeader(header: string, isBearer: boolean){
        const splitToken = header.split(' ')

        const prefix = isBearer ? 'Bearer' : 'Basic';

        if(splitToken.length !== 2 || splitToken[0] !== prefix){
            throw new UnauthorizedException('잘못된 토큰입니다.')
        }
        const token = splitToken[1];

        return token;
    }


    async authenticateWithEmailAndPassword(user: Pick<UsersModel, 'email' | 'password'>) {

        const existingUser = await this.usersService.getUserByEmail(user.email);
        
        if(!user){
            throw new UnauthorizedException('존재하지 않는 사용자입니다.')
        }


        const passOk = bcrypt.compare(user.password, existingUser.password)

        if(!passOk){
            throw new UnauthorizedException('비밀번호가 틀렸습니다.')
        }

        return existingUser;
    }

    decodeBasicToken(base64String: string){
        const decoded = Buffer.from(base64String, 'base64').toString('utf8')

        const split = decoded.split(':');
        if(split.length !== 2){
            throw new UnauthorizedException('잘못된 유형의 토큰입니다.')
        }

        const email = split[0];
        const password = split[1];

        return {
            email,
            password,
        }
    }

    // 토큰 검증
    verifyToken(token: string) {
        return this.jwtService.verify(token, {
            secret: JWT_SECRET,
        })
    }
    
    rotateToken(token: string, isRefreshToken: boolean){
        const decoded = this.jwtService.verify(token,{
            secret: JWT_SECRET,
        })

        if(decoded.type !== 'refresh'){
            throw new UnauthorizedException('토큰 재발급은 Refresh 토큰으로만 가능합니다')
        }

        return this.signToken({
            ...decoded,
        }, isRefreshToken)
    }

    async loginWithEmail(user: Pick<UsersModel, 'email' | 'password'>){
        const existingUser = await this.authenticateWithEmailAndPassword(user);

        return this.loginUser(existingUser);
    }

    async registerWithEmail(user: Pick<UsersModel, 'name' | 'email' | 'password'>){
        const hash = await bcrypt.hash(
            user.password,
            HASH_ROUNDS,
        );

        const newUser = await this.usersService.createUser({
            ...user,
            password: hash,
        });

        return this.loginUser(newUser)
    }






}
