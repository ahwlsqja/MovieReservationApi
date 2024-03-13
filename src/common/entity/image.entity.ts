import { IsEnum, IsInt, IsOptional, IsString } from "class-validator";
import { BaseModel } from "./base.entity";
import { Column, JoinColumn, ManyToOne } from "typeorm";
import { Transform } from "class-transformer";
import { join } from "path";
import { SHOW_PUBLIC_IMAGE_PATH } from "../const/path.const";
import { Show } from "src/shows/entities/show.entity";

export enum ImageModelType{
    SHOWS,
    USERS
}
export class  ImageModel extends BaseModel{
    @Column({
        default: 0,
    })
    @IsInt()
    @IsOptional()
    order: number;

    // UsersModel -> 사용자 관련 이미지
    // ShowsModel -> 포스트 이미지
    @Column({
        enum: ImageModelType,
    })
    @IsEnum(ImageModelType)
    type: ImageModelType

    @Column()
    @IsString()
    @Transform(({value, obj}) => {
        if(obj.type === ImageModelType.SHOWS){
            return `${join(
                SHOW_PUBLIC_IMAGE_PATH,
                value,
            )}`
        } else{
            return value;
        }
    })
    path: string;
}