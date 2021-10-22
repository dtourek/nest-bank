import { Controller, Post, Body, HttpStatus, HttpException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/registerUserDto';
import { either } from 'fputils';
import UserEntity from '../../entities/UserEntity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  async register(@Body() registerDto: RegisterUserDto): Promise<UserEntity> {
    return either(
      (error) => {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      },
      (result) => result,
      await this.authService.register(registerDto),
    );
  }
}
