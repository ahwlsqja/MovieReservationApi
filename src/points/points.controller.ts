import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PointsService } from './points.service';


@Controller('points')
export class PointsController {
  constructor(private readonly pointsService: PointsService) {}
}
