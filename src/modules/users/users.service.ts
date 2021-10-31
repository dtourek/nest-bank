import { Injectable, Logger } from '@nestjs/common';
import UserEntity from '../../entities/UserEntity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegisterUserDto } from './dto/registerUserDto';
import { isLeft, Left, Maybe, Right, tryCatch } from 'fputils';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}
  private readonly logger = new Logger('UserService');

  create = async ({ username, password }: RegisterUserDto): Promise<Maybe<UserEntity>> => {
    const exists = await this.findUser(username);

    if (isLeft(exists)) {
      const errorMessage = `Failed to get user: ${username}`;
      this.logger.error(errorMessage);
      return Left(new Error(errorMessage));
    }

    if (exists.value) {
      this.logger.error(`User ${username} already exist!`);
      return Left(new Error(`User with same username: ${username} already exist!`));
    }

    const user = new UserEntity();
    user.username = username;
    user.password = password;

    try {
      const result = await this.usersRepository.save(user);
      this.logger.log(`User ${result.username} registered successfully`);

      return Right(result);
    } catch (error) {
      this.logger.error(`Failed to create user ${error.message}`);
      return Left(new Error(`Failed to create user: ${error.message}`));
    }
  };

  findUser = async (username: string): Promise<Maybe<UserEntity | undefined>> => tryCatch(async () => this.usersRepository.findOne({ where: { username } }));
}
