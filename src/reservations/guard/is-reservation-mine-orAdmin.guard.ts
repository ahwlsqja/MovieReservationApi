import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { Observable } from "rxjs";
import { RolesEnum } from "src/users/const/roles.const";
import { ReservationsService } from "../reservations.service";
import { Request } from "express";
import { UsersModel } from "src/users/entities/users.entity";

@Injectable()
export class IsReservationMineOrAdmin implements CanActivate{
    constructor(
        private readonly reservationsService: ReservationsService
    ){}
    
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest() as Request & {user: UsersModel};

        const {user} = req;

        if(!user) {
            throw new UnauthorizedException(
                '사용자 정보를 가져올 수 없습니다.',
            )
        }

        /**
         * Admin인 경우 그냥 패스
         */
        if(user.role === RolesEnum.ADMIN){
            return true;
        }

        const reservationId = req.params.reservationId;

        if(!reservationId){
            throw new BadRequestException(
                'Reservation Id가 파라미터로 제공되야합니다.',
            );
        }

        const isOk = await this.reservationsService.isReservationMine(
            user.id,
            parseInt(reservationId),
        )

        if(!isOk){
            throw new ForbiddenException(
                '권한이 없습니다.'
            )
        }

        return true;
    }   
}