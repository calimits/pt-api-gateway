import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from "../app.module";
import { randomUUID } from 'crypto';
import { CreateUserDto } from '../features/auth/dtos/CreateUserDto';
import AppDataSource from '../config/data-source';
import cookieParser from 'cookie-parser';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    await AppDataSource.initialize();
    app = moduleFixture.createNestApplication();
    app.use(cookieParser());
    await app.init();
  });

  afterAll(async () => {
    await AppDataSource.destroy();
    await app.close();
  });

  describe('POST auth/register', () => {
    const uuid: string = randomUUID();
    const user: CreateUserDto = {email: `${uuid}@gmail.com`, password: uuid};

    it("Should register one user succesfully", async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/register')
        .send(user);
      
      expect(res.body).toEqual({email: user.email, id: expect.any(Number)});
    });
  });

  describe('POST auth/login', () => {
    const uuid: string = randomUUID();
    const user: CreateUserDto = {email: `${uuid}@gmail.com`, password: uuid};

    it("Should login succesfully", async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/register')
        .send(user);
      
      const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({email: user.email, password: user.password});

      expect(loginRes.body).toEqual({
        refreshToken: expect.any(String),
        accessToken: expect.any(String),
        userInfo: {id: expect.any(Number), email: user.email}
      });

    });

    it("Should not login succesfully", async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/register')
        .send(user);
      
      const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({email: user.email, password: "aklsdh"});

      expect(loginRes.statusCode).toBe(400);

    });
  });

  describe('GET auth/logout', () => {
    const uuid: string = randomUUID();
    const user: CreateUserDto = {email: `${uuid}@gmail.com`, password: uuid};

    it("Should logout succesfully", async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/register')
        .send(user);
      
      const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({email: user.email, password: user.password});

      const logoutRes = await request(app.getHttpServer())
      .get(`/auth/logout/${loginRes.body.userInfo.id}`)
      .send({email: user.email, password: user.password});

      expect(logoutRes.statusCode).toBe(200);

    });

  });

  describe('POST auth/refresh-tokens', () => {
    const uuid: string = randomUUID();
    const user: CreateUserDto = {email: `${uuid}@gmail.com`, password: uuid};

    it("Should refresh tokens succesfully", async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/register')
        .send(user);
      
      const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({email: user.email, password: user.password});

      const cookies = loginRes.headers['set-cookie'];

      const refreshRes = await request(app.getHttpServer())
        .post(`/auth/refresh-tokens`)
        .send({token: loginRes.body.refreshToken});

      expect(refreshRes.body).toEqual({accessToken: expect.any(String), refreshToken: expect.any(String)});

    });

  })

  describe('POST auth/validate-token', () => {
    const uuid: string = randomUUID();
    const user: CreateUserDto = {email: `${uuid}@gmail.com`, password: uuid};

    it("Should validate succesfully", async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/register')
        .send(user);
      
      const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({email: user.email, password: user.password});

      const validateRes = await request(app.getHttpServer())
      .get("/auth/validate-token")
      .send({token: loginRes.body.accessToken});

      expect(validateRes.statusCode).toBe(200)

    });

  });
  

});
