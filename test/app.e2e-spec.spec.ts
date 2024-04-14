import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { randomString } from './utils/randomString';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let signupUser: { username: string; password: string };
  let lastAccessToken: string;

  const runSignup = async () => {
    await request(app.getHttpServer())
      .post('/signup')
      .send(signupUser)
      .expect(201)
      .expect((res) => {
        expect(res.body.username).toBe(signupUser.username);
      });
  };

  const runLogin = async () => {
    await request(app.getHttpServer())
      .post('/login')
      .send(signupUser)
      .expect(201)
      .expect((res) => {
        expect(res.body.accessToken).toBeDefined();
        lastAccessToken = res.body.accessToken;
      });
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    signupUser = {
      username: randomString(),
      password: randomString(),
    };
  });

  describe('Auth', () => {
    it('/signup (POST)', () => {
      return runSignup();
    });

    it('/login (POST)', async () => {
      await runSignup();
      await runLogin();
    });
  });

  describe('Tasks', () => {
    const runCreateTask = async () => {
      let taskId: string;
      const taskData = {
        title: randomString(),
        description: randomString(),
      };
      await request(app.getHttpServer())
        .post('/tasks')
        .send(taskData)
        .set('Authorization', `Bearer ${lastAccessToken}`)
        .expect(201)
        .expect((res) => {
          taskId = res.body.id;
          expect(res.body.title).toBeDefined();
        });

      return { taskId, ...taskData };
    };

    it('/tasks (POST)', async () => {
      await runSignup();
      await runLogin();
      await runCreateTask();
    });

    it('/tasks (GET)', async () => {
      await runSignup();
      await runLogin();
      const { taskId } = await runCreateTask();
      await request(app.getHttpServer())
        .get('/tasks')
        .set('Authorization', `Bearer ${lastAccessToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.length).toBe(1);
          expect(res.body[0].id).toBe(taskId);
        });
    });

    it('/tasks/:id (PATCH)', async () => {
      await runSignup();
      await runLogin();
      const { taskId, title: originalTitle } = await runCreateTask();

      await request(app.getHttpServer())
        .patch(`/tasks/${taskId}`)
        .send({
          title: randomString(),
          description: randomString(),
        })
        .set('Authorization', `Bearer ${lastAccessToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.title).toBeDefined();
          expect(res.body.title).not.toEqual(originalTitle);
        });
    });
  });
});
