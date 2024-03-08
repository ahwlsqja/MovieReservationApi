import { Body, Controller, Post, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PasswordPipe } from './pipe/password.pipe';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('token/access')
  postTokenAccess(@Headers('authorization') rawToken: string){
    const token = this.authService.extractTokenFromHeader(rawToken, true);

    const newToken = this.authService.rotateToken(token, false);

    return {
      accessToken: newToken,
    }
  }

  @Post('token/refresh')
  postTokenRefresh(@Headers('authorization') rawToken: string){
    const token = this.authService.extractTokenFromHeader(rawToken, true);

    const newToken = this.authService.rotateToken(token, true);

    return {
      refreshToken: newToken,
    }
  }

  @Post('login/email')
  postloginEmail(
    @Headers('authorization') rawToken: string,
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