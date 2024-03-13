import { Controller, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { CommonService } from './common.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { AccessTokenGuard } from 'src/auth/guard/bearer-token.guard';

@Controller('common')
export class CommonController {
  constructor(private readonly commonService: CommonService) {}

  @Post('image')
  @UseInterceptors(FileInterceptor('image'))
  showImage(
    @UploadedFile() file: Express.Multer.File,
  ){
    return {
      fileName: file.filename,
    }

  }
}


// A Model이있꼬 B 모델잉있다
// Show API -> A 저장, B 저장
// await repository.save(a);
// await repository.save(b);
//
// 만약에 a를 저장하다가 실패하면 b를 저장하면 안될까?
// all or nothing