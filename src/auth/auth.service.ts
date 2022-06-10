import { ForbiddenException, Injectable } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

@Injectable()
export class AuthService {
  // dependency injection
  constructor(private prisma: PrismaService) {}
  // pass dto and its class AuthDto to the signup function
  async signup(dto: AuthDto) {
    // generate the password
    const hash = await argon.hash(dto.password);
    // add try catch
    try {
      // save the new user in the db
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
        },
      });
      // transformer removes user hash in object for security
      delete user.hash;
      // return the saved user
      return user;
    } catch (error) {
      // if error is known to Prisma (part of PrismaClientKnownRequestError object)
      if (error instanceof PrismaClientKnownRequestError) {
        // code is equal to the duplicate code
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials taken');
        }
      }
      throw error;
    }
  }
  login() {
    return { message: 'I am logged in' };
  }
}
