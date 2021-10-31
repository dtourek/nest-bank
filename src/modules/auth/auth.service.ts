import { Injectable, Logger } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ITokenUser } from '../../interfaces';
import { isLeft } from 'fputils';

interface ITokenPayload {
  accessToken: string;
}

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private readonly jwtService: JwtService) {}

  private readonly logger = new Logger('AuthService');

  async validateUser(username: string, password: string): Promise<ITokenUser | null> {
    this.logger.debug(`Validate user: ${username} initiated`);

    const user = await this.usersService.findUser(username);
    if (isLeft(user)) {
      this.logger.error(`Failed to get user: ${username}`);
      return null;
    }

    if (user.value && user.value.password === password) {
      this.logger.log(`User ${username} verified successfully`);
      return { username: user.value.username, userId: user.value.id };
    }

    this.logger.error(`Verification for user: ${username} failed`);
    return null;
  }

  login = ({ username, userId }: ITokenUser): ITokenPayload => ({
    accessToken: this.jwtService.sign({ username, sub: userId }),
  });
}
