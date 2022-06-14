import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  // pass in the config to access the secret
  constructor(config: ConfigService, private prisma: PrismaService) {
    super({
      // method JWT will be extracted from request
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // secret for signing the token
      secretOrKey: config.get('JWT_SECRET'),
    });
  }

  async validate(payload: { sub: number; email: string }) {
    // find the user by id
    const user = await this.prisma.user.findUnique({
      where: {
        id: payload.sub,
      },
    });
    // deleter hash
    delete user.hash;
    return user;
  }
}
