import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';

// add global prefix route 'auth'
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // route => POST /auth/signup
  @Post('signup')
  // access express' Req's Body Request Type
  signup(@Body() dto: AuthDto) {
    // pass dto in the signup function
    return this.authService.signup(dto);
  }

  // HttpCode decorator
  @HttpCode(HttpStatus.OK)
  // route => POST /auth/login
  @Post('login')
  login(@Body() dto: AuthDto) {
    // pass dto in the signup function
    return this.authService.login(dto);
  }
}
