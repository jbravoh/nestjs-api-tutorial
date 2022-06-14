import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Controller('users')
export class UserController {
  // use passport's guard (AuthGuard) and pass in the jwt strategy
  @UseGuards(AuthGuard('jwt'))
  // Routes GET Requests handler decorator -> GET /users/me
  @Get('me')
  // get user information
  getMe(@Req() req: Request) {
    console.log({
      user: req.user,
    });
    return req.user;
  }
}
