import { Controller, Request, Post, UseGuards, Get, Body, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { AuthService } from './modules/auth/auth.service';
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
  private readonly logger = new Logger('AppController');

  @UseGuards(LocalAuthGuard)
  @Public()
  @Post('login')
  async login(@Request() { user }: ICommonAuthenticatedRequest) {
    this.logger.debug(`POST /login initiated by ${user.username}`);
    return this.authService.login(user);
  }

  @Public()
  @Post('register')
  async register(@Body() registerDto: RegisterUserDto): Promise<UserEntity> {
    this.logger.debug(`Register user: ${registerDto.username} initiated`);

    return either(
      (error) => {
        this.logger.error(error.message);
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      },
      (result) => {
        this.logger.log(`Register user: ${registerDto.username} succeeded`);
        return result;
      },
      await this.userService.create(registerDto),
    );
  }
}
