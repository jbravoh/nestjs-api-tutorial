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

  // pass dto and its class AuthDto to the login function
  async login(dto: AuthDto) {
    // find the user by email
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    // if user does not exist throw exception
    if (!user) throw new ForbiddenException('Credentials incorrect');

    // compare passwords
    const pwdMatches = await argon.verify(user.hash, dto.password);

    // if password incorrect throw exception
    if (!pwdMatches) throw new ForbiddenException('Credentials incorrect');

    // send back the user
    delete user.hash;
    return user;
  }
}
