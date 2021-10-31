import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import UserEntity from '../../../entities/UserEntity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MockType, repositoryMockFactory } from '../../../testHelpers';
import { isLeft, isRight } from 'fputils';
import { UsersService } from '../users.service';

describe('UsersService', () => {
  let service: UsersService;
  let repositoryMock: MockType<Repository<UserEntity>>;

  const user: UserEntity = { id: 1, username: 'user', password: 'password' };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, { provide: getRepositoryToken(UserEntity), useFactory: repositoryMockFactory }],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repositoryMock = module.get(getRepositoryToken(UserEntity));
  });

  describe('create', () => {
    it('should throw error and fallback to catch block', async () => {
      repositoryMock.findOne.mockImplementation(() => {
        throw new Error('Connect to database failed!');
      });
      const result = await service.create({ username: user.username, password: user.password });
      expect(isLeft(result)).toEqual(true);
      expect(result.value).toEqual(Error('Failed to get user: user'));
    });

    it('should fail to create user when username is already taken', async () => {
      repositoryMock.findOne.mockReturnValueOnce(user);
      repositoryMock.save.mockReturnValueOnce(user);

      const result = await service.create({ username: user.username, password: user.password });
      expect(isLeft(result)).toEqual(true);
      expect(result.value).toEqual(Error('User with same username: user already exist!'));
    });

    it('should create user', async () => {
      repositoryMock.findOne.mockReturnValueOnce(undefined);
      repositoryMock.save.mockReturnValueOnce(user);

      const result = await service.create({ username: user.username, password: user.password });
      expect(isRight(result)).toEqual(true);
      expect(result.value).toEqual({
        id: 1,
        password: user.password,
        username: user.username,
      });
    });
  });
});
