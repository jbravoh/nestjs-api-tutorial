import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PrismaService } from '../src/prisma/prisma.service';
import { AppModule } from '../src/app.module';
import * as pactum from 'pactum';
import { AuthDto } from 'src/auth/dto';
import { EditUserDto } from 'src/user/dto';
import { CreateBookmarkDto, EditBookmarkDto } from 'src/bookmark/dto';

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
          .expectStatus(201)
          .stores('userAccessToken', 'access_token'); // store access token
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

  describe('User', () => {
    describe('Get me', () => {
      it('should get current user', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withHeaders({
            Authorization: 'Bearer $S{userAccessToken}',
          })
          .expectStatus(200);
      });
    });

    describe('Edit user', () => {
      it('should edit user', () => {
        const dto: EditUserDto = {
          firstName: 'Jay',
          email: 'jbravoharriott@gmail.com',
        };
        return pactum
          .spec()
          .patch('/users')
          .withHeaders({
            Authorization: 'Bearer $S{userAccessToken}',
          })
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.firstName)
          .expectBodyContains(dto.email);
      });
    });
  });

  describe('Bookmarks', () => {
    // use case test
    describe('Get empty bookmarks', () => {
      it('should get bookmarks', () => {
        return pactum
          .spec()
          .get('/bookmarks')
          .withHeaders({
            Authorization: 'Bearer $S{userAccessToken}',
          })
          .expectStatus(200)
          .expectBody([]);
      });
    });

    describe('Create bookmark', () => {
      const dto: CreateBookmarkDto = {
        title: 'First bookmark',
        link: 'https://www.youtube.com/watch?v=GHTA143_b-s&t=11180s',
      };
      it('should create bookmark', () => {
        return pactum
          .spec()
          .post('/bookmarks')
          .withHeaders({
            Authorization: 'Bearer $S{userAccessToken}',
          })
          .withBody(dto)
          .expectStatus(201)
          .inspect()
          .stores('bookmarkId', 'id'); // store bookmark id
      });
    });

    describe('Get bookmark', () => {
      it('should get bookmarks', () => {
        return pactum
          .spec()
          .get('/bookmarks')
          .withHeaders({
            Authorization: 'Bearer $S{userAccessToken}',
          })
          .expectStatus(200)
          .expectJsonLength(1);
      });
    });

    describe('Get bookmark by id', () => {
      it('should get bookmark by id', () => {
        return pactum
          .spec()
          .get('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAccessToken}',
          })
          .expectStatus(200)
          .expectBodyContains('$S{bookmarkId}');
      });
    });

    describe('edit bookmark by id', () => {
      const dto: EditBookmarkDto = {
        title: 'NestJs Course for Beginners - Create a REST API',
        description:
          'Learn NestJs by building a CRUD REST API with end-to-end tests using modern web development techniques. NestJs is a rapidly growing node js framework that helps build scalable and maintainable backend applications. In this course, we build a bookmarks API from scratch using nestJs, docker, postgres, passport js, prisma, pactum and dotenv.',
      };
      it('should edit bookmark by id', () => {
        return pactum
          .spec()
          .patch('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withBody(dto)
          .withHeaders({
            Authorization: 'Bearer $S{userAccessToken}',
          })
          .expectStatus(200)
          .expectBodyContains(dto.title)
          .expectBodyContains(dto.description);
      });
    });

    describe('delete bookmark by id', () => {
      it('should delete bookmark by id', () => {
        return pactum
          .spec()
          .delete('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAccessToken}',
          })
          .expectStatus(204);
      });

      it('should get empty bookmarks', () => {
        return pactum
          .spec()
          .get('/bookmarks')
          .withHeaders({
            Authorization: 'Bearer $S{userAccessToken}',
          })
          .expectStatus(200)
          .expectJsonLength(0);
      });
    });
  });
});
