import { Body, Controller, Post, Headers, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PasswordPipe } from './pipe/password.pipe';
import { BasicTokenGuard } from './guard/basic-token.guard';
import { AccessTokenGuard, RefreshTokenGuard } from './guard/bearer-token.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('token/access')
  @UseGuards(AccessTokenGuard)
  postTokenAccess(@Headers('authorization') rawToken: string){
    const token = this.authService.extractTokenFromHeader(rawToken, true);

    const newToken = this.authService.rotateToken(token, false);

    return {
      accessToken: newToken,
    }
  }

  @Post('token/refresh')
  @UseGuards(RefreshTokenGuard)
  postTokenRefresh(@Headers('authorization') rawToken: string){
    const token = this.authService.extractTokenFromHeader(rawToken, true);

    const newToken = this.authService.rotateToken(token, true);

    return {
      refreshToken: newToken,
    }
  }

  @Post('login/email')
  @UseGuards(BasicTokenGuard)
  postloginEmail(
    @Headers('authorization') rawToken: string,
    @Request() req,
  ){
    const token = this.authService.extractTokenFromHeader(rawToken, false);

    const credentials = this.authService.decodeBasicToken(token);
    return this.authService.loginWithEmail(credentials)
  }


  @Post('register/email')
  postregisterEmail(@Body('name') name: string,
    @Body('email') email: string,
    @Body('password', PasswordPipe) password: string){
      return this.authService.registerWithEmail({
        name,
          email,
      password,
      })
    }

}
