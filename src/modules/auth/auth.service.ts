import { Injectable } from '@nestjs/common';
import UserEntity from '../../entities/UserEntity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegisterUserDto } from './dto/registerUserDto';
import { Left, Maybe, Right } from 'fputils';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  register = async ({ username, password }: RegisterUserDto): Promise<Maybe<UserEntity>> => {
    try {
      const exists = await this.usersRepository.findOne({ where: { username } });
      if (exists) {
        console.log(`User ${username} already exist!`);
        return Left(new Error(`User with same username: ${username} already exist!`));
      }

      const user = new UserEntity();
      user.username = username;
      user.password = password;

      const result = await this.usersRepository.save(user);

      console.log(`User ${result.username} register success`);
      return Right(result);
    } catch (error) {
      return Left(new Error(`Failed to create user: ${error.message}`));
    }
  };
}
