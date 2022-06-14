import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  // pass in the config to access the secret
  constructor(config: ConfigService) {
    super({
      // method JWT will be extracted from request
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // secret for signing the token
      secretOrKey: config.get('JWT_SECRET'),
    });
  }
}
