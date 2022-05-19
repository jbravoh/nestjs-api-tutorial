import { Injectable } from '@nestjs/common';
import { User, Bookmark } from '@prisma/client';

@Injectable()
export class AuthService {
  signup() {
    return { message: 'I am signed up' };
  }
  login() {
    return { message: 'I am logged in' };
  }
}
