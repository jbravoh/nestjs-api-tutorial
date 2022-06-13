import { Controller, Post, Body } from '@nestjs/common';
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

  // route => POST /auth/login
  @Post('login')
  login(@Body() dto: AuthDto) {
    // pass dto in the signup function
    return this.authService.login(dto);
  }
}
