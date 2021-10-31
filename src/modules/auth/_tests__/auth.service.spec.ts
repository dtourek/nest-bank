import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { UsersModule } from '../../users/usersModule';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import UserEntity from '../../../entities/UserEntity';
import { MockType, repositoryMockFactory } from '../../../testHelpers';
import { UsersService } from '../../users/users.service';
import { isLeft } from 'fputils';
import { getConnection, Repository } from 'typeorm';
import { LocalStrategy } from '../local/local.strategy';
import { JwtStrategy } from '../jwt/jwt.strategy';
import PaymentEntity from '../../../entities/PaymentEntity';

// TODO - fix this test!
xdescribe('AuthService', () => {
  let service: AuthService;
  let userService: UsersService;
  let repositoryMock: MockType<Repository<UserEntity>>;

  const testConnectionName = 'testConnection';

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        UsersModule,
        PassportModule,
        JwtModule.register({
          secret: 'someSecretStuffLikePassword123',
          signOptions: { expiresIn: '60s' },
        }),
      ],

      providers: [
        AuthService,
        { provide: getRepositoryToken(UserEntity), useFactory: repositoryMockFactory },
        { provide: getRepositoryToken(PaymentEntity), useFactory: repositoryMockFactory },
        LocalStrategy,
        JwtStrategy,
        UsersService,
      ],
    }).compile();

    service = moduleRef.get<AuthService>(AuthService);
    userService = moduleRef.get<UsersService>(UsersService);
    repositoryMock = moduleRef.get(getRepositoryToken(UserEntity));
  });

  afterEach(async () => {
    await getConnection(testConnectionName).close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return a user object when credentials are valid', async () => {
      const userMock = { id: 1, username: 'username', password: 'password' };

      repositoryMock.findOne.mockReturnValueOnce(() => userMock);

      const user = await userService.create({ username: userMock.username, password: userMock.password });
      if (isLeft(user)) {
        fail(`Should success! ${user.value}`);
      }

      const res = await service.validateUser(user.value.username, user.value.password);
      console.log(res);
    });

    it('should return null when credentials are invalid', async () => {
      const res = await service.validateUser('xxx', 'xxx');
      expect(res).toBeNull();
    });
  });

  describe('validateLogin', () => {
    it('should return JWT object when credentials are valid', async () => {
      const res = await service.login({ username: 'john', userId: 5 });
      expect(res.accessToken).toBeDefined();
    });
  });
});
