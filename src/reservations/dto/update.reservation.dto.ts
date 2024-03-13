import { PartialType } from "@nestjs/swagger";
import { CreateReservationDto } from "./create.reservation.dto";

export class UpdatereservationDto extends PartialType(CreateReservationDto){}