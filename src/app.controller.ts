import { Controller, Request, Post, UseGuards, Get, Body, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from './modules/auth/auth.service';
import { logger } from './helpers';
import { ICommonAuthenticatedRequest } from './interfaces';
import { UsersService } from './modules/users/users.service';
import { RegisterUserDto } from './modules/users/dto/registerUserDto';
import { Public } from './decorators';
import UserEntity from './entities/UserEntity';
import { either } from 'fputils';
import { LocalAuthGuard } from './modules/auth/local/local-auth.guard';

@Controller()
export class AppController {
  constructor(private authService: AuthService, private userService: UsersService) {}

  @UseGuards(LocalAuthGuard)
  @Public()
  @Post('login')
  async login(@Request() { user }: ICommonAuthenticatedRequest) {
    logger('debug', `POST /login initiated by ${user.username}`);
    return this.authService.login(user);
  }

  @Public()
  @Post('register')
  async create(@Body() registerDto: RegisterUserDto): Promise<UserEntity> {
    return either(
      (error) => {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      },
      (result) => result,
      await this.userService.create(registerDto),
    );
  }

  @Get('profile')
  getProfile(@Request() req) {
    logger('debug', `Request to profile initiated by user: ${req.user.username}`);
    return this.userService.findUser(req.user.username);
  }
}
