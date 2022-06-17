import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';

import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { EditUserDto } from './dto';
import { UserService } from './user.service';

// use the jwt custom guard (cleaner that AuthGuard('jwt'))
@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  // add a constructor and inject UserService
  constructor(private userService: UserService) {}
  // Routes GET Requests handler decorator -> GET /users/me
  @Get('me')
  // use the custom param decorator @GetUser
  getMe(@GetUser() user: User) {
    return user;
  }

  // Routes PATCH Requests handler decorator -> PATCH /users
  @Patch()
  editUser(@GetUser('id') userId: number, @Body() dto: EditUserDto) {
    // pass in the userId and the dto so userService has access
    return this.userService.editUser(userId, dto);
  }
}
