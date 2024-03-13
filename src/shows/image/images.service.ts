// import { BadRequestException, Injectable } from "@nestjs/common";
// import { InjectRepository } from "@nestjs/typeorm";
// import { basename, join } from "path";
// import { SHOWS_IMAGE_PATH, TEMP_FOLDER_PATH } from "src/common/const/path.const";
// import { ImageModel } from "src/common/entity/image.entity";
// import { QueryRunner, Repository } from "typeorm";
// import { CreateShowImageDto } from "./dto/create-image.dto";
// import { promises } from "fs";

// @Injectable()
// export class ShowsImagesService{
//     constructor(
//         @InjectRepository(ImageModel)
//         private readonly imageRepository : Repository<ImageModel>
//     ) {

//     }
//     getRepository(qr?: QueryRunner){
//         return qr ? qr.manager.getRepository<ImageModel>(ImageModel) : this.imageRepository;
//     }

//     async createShowImage(createShowImageDto: CreateShowImageDto, qr?: QueryRunner){
//         const repository = this.getRepository(qr);
//         // dto의 이미지이름을 기반으로
//         // 파일의 경로를 생성한다.
//         const tempFilePath = join(
//             TEMP_FOLDER_PATH,
//             createShowImageDto.path,
//         );

//         try{
//             // 파일 존재안하면 에러떤짐
//             await promises.access(tempFilePath);
//         } catch(e){
//             throw new BadRequestException('존재하지 않는 파일 입니다.')
//         }

//         // 파일의 이름 가져오기
//         // /Users/aaa/bbb/ccc/asdf.jpg => asdf.jpg
//         const fileName = basename(tempFilePath);

//         // 새로 갈 쇼 폴더의 경로 + 사진 이름
//         // /shows/asdf.jpg
//         const newPath = join(
//             SHOWS_IMAGE_PATH,
//             fileName,
//         )

//         // save
//         const result = await repository.save({
//             ...createShowImageDto,
//         })
        
//         await promises.rename(tempFilePath, newPath)

//         return result
//     }
// }