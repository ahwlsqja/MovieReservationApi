import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersModel } from 'src/users/entities/users.entity';
import * as bcrypt from "bcrypt";
import { UsersService } from 'src/users/users.service';
import { ConfigService } from '@nestjs/config';
import { ENV_HASH_ROUND_KEY, ENV_JWT_SECRET_KEY } from 'src/common/const/env-keys.const';

@Injectable()
export class AuthService {

    constructor(
        private readonly jwtService: JwtService,
        private readonly usersService: UsersService,
        private readonly configService: ConfigService,
    ){}
    

    signToken(user: Pick<UsersModel, 'email' | 'id'>, isRefreshToken: boolean){
        const payload = {
            email: user.email,
            sub: user.id,
            type: isRefreshToken ? 'refresh' : 'access',
        };


        return this.jwtService.sign(payload, {
            secret: this.configService.get<string>(ENV_JWT_SECRET_KEY),
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

        console.log(user.email)

        const existingUser = await this.usersService.getUserByEmail(user.email);
        console.log(1)
        console.log(existingUser.email)
        console.log(existingUser.password)

        
        if(!user){
            throw new UnauthorizedException('존재하지 않는 사용자입니다.')
        }

        console.log(2)
        console.log(user.password)
        console.log(existingUser.password)
        const passOk = await bcrypt.compare(user.password, existingUser.password)
        console.log(3)

        console.log(passOk)

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
        console.log(password)
        return {
            email,
            password,
        }
    }

    // 토큰 검증
    verifyToken(token: string) {
        try{ 
        return this.jwtService.verify(token, {
            secret: this.configService.get<string>(ENV_JWT_SECRET_KEY),
        })
        }catch(e){
            throw new UnauthorizedException('토큰이 만료됬거나 잘못된토큰입니다.')
        }
    }
    
    rotateToken(token: string, isRefreshToken: boolean){
        const decoded = this.jwtService.verify(token,{
            secret: this.configService.get<string>(ENV_JWT_SECRET_KEY),
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
            parseInt(this.configService.get<string>(ENV_HASH_ROUND_KEY)),
        );

        const newUser = await this.usersService.createUser({
            ...user,
            password: hash,
        });

        return this.loginUser(newUser)
    }






}
