import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PrismaService } from '../src/prisma/prisma.service';
import { AppModule } from '../src/app.module';
import * as pactum from 'pactum';
import { AuthDto } from 'src/auth/dto';

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
    // port the app will listen to
    await app.listen(3333);
    // get the PrismaService provider
    prisma = app.get(PrismaService);
    // clear the test database by calling the cleanDb function
    await prisma.cleanDb();
    // set base url
    pactum.request.setBaseUrl('http://localhost:3333');
  });

  // teardown
  afterAll(() => {
    app.close();
  });

  describe('Auth', () => {
    // all 'Auth' tests can use the dto
    const dto: AuthDto = {
      email: 'test@test.com',
      password: '123 ',
    };
    // signup test
    describe('Signup', () => {
      // signup use case: empty email
      it('should throw exception if email empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            password: dto.password,
          })
          .expectStatus(400);
      });
      // signup use case: empty password
      it('should throw exception if password empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            email: dto.email,
          })
          .expectStatus(400);
      });
      // signup use case: no body provided
      it('should throw exception if no body provided', () => {
        return pactum.spec().post('/auth/signup').expectStatus(400);
      });
      // successful signup
      it('should signup', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201);
      });
    });
    // login tests
    describe('Login', () => {
      // login use case: empty email
      it('should throw exception if email empty', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody({
            password: dto.password,
          })
          .expectStatus(400);
      });
      // login use case: empty password
      it('should throw exception if password empty', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody({
            email: dto.email,
          })
          .expectStatus(400);
      });
      // login use case: no body provided
      it('should throw exception if no body provided', () => {
        return pactum.spec().post('/auth/login').expectStatus(400);
      });
      // successful login
      it('should login', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody(dto)
          .expectStatus(200);
      });
    });
  });

  // describe('User', () => {
  //   describe('Get me', () => {
  //     it.todo('should get user');
  //   });

  //   describe('Edit user', () => {
  //     it.todo('should edit user');
  //   });
  // });

  // describe('Bookmarks', () => {
  //   describe('Create bookmark', () => {
  //     it.todo('should create bookmark');
  //   });
  //   describe('Get bookmark', () => {
  //     it.todo('should get bookmark');
  //   });
  //   describe('Get bookmark by id', () => {
  //     it.todo('should get bookmark by id');
  //   });
  //   describe('edit bookmark', () => {
  //     it.todo('should edit bookmark');
  //   });
  //   describe('delete bookmark', () => {
  //     it.todo('should delete bookmark');
  //   });
  // });
});
