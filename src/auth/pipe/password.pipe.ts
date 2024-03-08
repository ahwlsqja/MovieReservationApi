import { PipeTransform, Injectable, ArgumentMetadata, BadGatewayException } from '@nestjs/common'

@Injectable()
export class PasswordPipe implements PipeTransform{
    transform(value: any, metadata: ArgumentMetadata) {
        if(value.length > 8){
            throw new BadGatewayException('비밀번호는 8자 이하로 입력해주세요!');
        }

        return value.toString();
    }
}