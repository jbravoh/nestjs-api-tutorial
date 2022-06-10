import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';

// add global prefix route 'auth'
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // create two functions

  @Post('signup')
  // route => POST /auth/signup
  // access express' Req's Body Request Type
  signup(@Body() dto: AuthDto) {
    // pass dto in the signup function
    return this.authService.signup(dto);
  }

  @Post('login')
  // route => POST /auth/login
  login() {
    return this.authService.login();
  }
}
