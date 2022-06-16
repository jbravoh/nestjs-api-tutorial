import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PrismaService } from '../src/prisma/prisma.service';
import { AppModule } from '../src/app.module';

describe('App e2e', () => {
  // abstract the app
  let app: INestApplication;
  // dependency injection to access PrismaService
  let prisma: PrismaService;

  // setup
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    // emulate the app
    app = moduleRef.createNestApplication();
    // copied from main.ts (simulating the server)
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    // initialise (start) server
    await app.init();
    // get the PrismaService provider
    prisma = app.get(PrismaService);
    // clear the test database by calling the cleanDb function
    await prisma.cleanDb();
  });

  // teardown
  afterAll(() => {
    app.close();
  });
  it.todo('should pass');
});
