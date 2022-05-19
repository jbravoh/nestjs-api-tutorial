import { Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

// add global prefix route 'auth'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // create two functions

  @Post('signup')
  // route => POST /auth/signup
  signup() {
    return this.authService.signup();
  }

  @Post('login')
  // route => POST /auth/login
  login() {
    return this.authService.login();
  }
}
