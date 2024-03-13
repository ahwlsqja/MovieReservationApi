// import { BadRequestException, Injectable, NestMiddleware } from "@nestjs/common";
// import { NextFunction, Request, Response } from "express";
// import { ShowsService } from "src/shows/shows.service";

// @Injectable()
// export class ShowExistMiddleware implements NestMiddleware{
//     constructor(
//         private readonly showService: ShowsService,
//     ){
//     }
//     async use(req: Request, res: Response, next: NextFunction) {
//         const showId = req.params.showId;

//         if(!showId){
//             throw new BadRequestException(
//                 'Show ID 파라미터는 필수입니다.',
//             )
//         }

//         const exists = await this.showService.checkShowExistById(
//             parseInt(showId),
//         );

//         if(!exists){
//             throw new BadRequestException(
//                 '해당하는 Show가 없습니다.'
//             )
//         }



//         next();
//     }
// }