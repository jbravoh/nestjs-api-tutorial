import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  // dependency injection
  constructor(private prisma: PrismaService) {}
  signup() {
    return { message: 'I am signed up' };
  }
  login() {
    return { message: 'I am logged in' };
  }
}
