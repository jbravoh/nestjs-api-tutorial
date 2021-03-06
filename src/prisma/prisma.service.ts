import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(config: ConfigService) {
    // super calls the constructor we are extending => Prisma Client
    super({
      datasources: {
        db: {
          // import url from .env file using a getter
          url: config.get('DATABASE_URL'),
        },
      },
    });
  }
  // teardown logic for testing
  cleanDb() {
    return this.$transaction([
      this.bookmark.deleteMany(),
      this.user.deleteMany(),
    ]);
  }
}
