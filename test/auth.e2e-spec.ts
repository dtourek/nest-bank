import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { getRepositoryToken } from '@nestjs/typeorm';
import UserEntity from '../src/entities/UserEntity';
import { repositoryMockFactory } from '../src/testHelpers';
import { AuthService } from '../src/modules/auth/auth.service';
import { ILeft, IRight } from 'fputils';
import { AppController } from '../src/app.controller';
import { UsersService } from '../src/modules/users/users.service';

// TODO - fix this
xdescribe('AppController (e2e)', () => {
  let app: INestApplication;
  let controller: AppController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [UsersService, { provide: getRepositoryToken(UserEntity), useFactory: repositoryMockFactory }],
    }).compile();

    controller = module.get<AppController>(AppController);
    service = module.get<UsersService>(UsersService);

    app = module.createNestApplication();
    await app.init();
  });

  it('should fail and return 400 on POST /register', () => {
    const message = `User with same username: john already exist!`;

    jest.spyOn(service, 'create').mockImplementation(async () => ({ tag: 'left', value: new Error(message) } as ILeft<Error>));
    return request(app.getHttpServer()).post('/auth/register').send({ username: 'john', password: 'password' }).expect(400).expect({ statusCode: 400, message });
  });

  it('should fail and return 400 on POST /register when something goes wrong', () => {
    const message = `Failed to create user: Connect to DB failed.`;

    jest.spyOn(service, 'create').mockImplementation(async () => ({ tag: 'left', value: new Error(message) } as ILeft<Error>));
    return request(app.getHttpServer()).post('/auth/register').send({ username: 'john', password: 'password' }).expect(400).expect({ statusCode: 400, message });
  });

  it('should success to register new user', async () => {
    const userBody = { username: 'john', password: 'password' };
    const mockResult = { id: 1, ...userBody };
    jest.spyOn(service, 'create').mockImplementation(async () => ({ tag: 'right', value: mockResult } as IRight<UserEntity>));
    return request(app.getHttpServer()).post('/auth/register').send(userBody).expect(201).expect(mockResult);
  });
});
