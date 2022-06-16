import { Controller, Get, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';

// use the jwt custom guard (cleaner that AuthGuard('jwt'))
@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  // Routes GET Requests handler decorator -> GET /users/me
  @Get('me')
  // use the custom param decorator @GetUser
  getMe(@GetUser() user: User) {
    return user;
  }
}
