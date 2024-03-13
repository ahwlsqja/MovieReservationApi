import { IsDate, IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { CreateShowDto } from "./show.create.dto";
import { PartialType } from "@nestjs/mapped-types";
import { Category } from "../types/category.type";

export class UpdateShowDto extends PartialType(CreateShowDto){
    @IsOptional()
  @IsString()
  title?: string;

  @IsEnum(Category)
  category?: Category;

  @IsOptional()
  @IsNumber()
  age?: number;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsNumber()
  hours?: number;

  @IsOptional()
  @IsString()
  startDate?: string;

  @IsOptional()
  @IsString()
  endDate?: string;
}