import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import UserEntity from '../../../entities/UserEntity';
import { repositoryMockFactory } from '../../../testHelpers';
import { ILeft, IRight } from 'fputils';
import { HttpException } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService, { provide: getRepositoryToken(UserEntity), useFactory: repositoryMockFactory }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should fail to create user anr return 400 status code', async () => {
    try {
      jest.spyOn(service, 'register').mockImplementation(async () => ({ tag: 'left', value: Error('Failed to get user') } as ILeft<Error>));
      await controller.register({ username: null, password: null });
      fail('Should not success, because service returned faulty result');
    } catch (error) {
      expect(error instanceof HttpException).toBe(true);
      expect(error.message).toEqual('Failed to get user');
    }
  });

  it('should return created user', async () => {
    try {
      const user = { id: 1, username: 'user', password: 'password' };
      const result = { tag: 'right', value: user };
      jest.spyOn(service, 'register').mockImplementation(async () => result as IRight<UserEntity>);

      expect(await controller.register({ username: 'user', password: 'password' })).toEqual({ id: 1, username: 'user', password: 'password' });
    } catch (error) {
      fail('Should not fall to catch block.');
    }
  });
});
