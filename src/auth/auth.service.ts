import { ForbiddenException, Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  // dependency injection
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}
  // pass dto and its class AuthDto to the signup function
  async signup(dto: AuthDto) {
    // generate the password
    const hash = await argon.hash(dto.password);
    try {
      // save the new user in the db
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
        },
      });
      // return the saved user

      return this.signToken(user.id, user.email);
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
    return this.signToken(user.id, user.email);
  }

  async signToken(
    userId: number,
    email: string,
    // change the promise type to an object
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
    };

    const secret = this.config.get('JWT_SECRET');
    // create a token variable
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret: secret,
    });
    // return an object
    return {
      access_token: token,
    };
  }
}
