import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

// add global decorator
@Global()
@Module({
  // PrismaService is imported in this module
  providers: [PrismaService],
  // PrismaService is exported so AuthModule can access it
  exports: [PrismaService],
})
export class PrismaModule {}
