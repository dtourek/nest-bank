import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ITokenUser } from '../../interfaces';

interface ITokenPayload {
  accessToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<ITokenUser | null> {
    const user = await this.usersService.findUser(username);
    if (user && user.password === password) {
      return { username: user.username, userId: user.id };
    }
    return null;
  }

  login = ({ username, userId }: ITokenUser): ITokenPayload => ({
    accessToken: this.jwtService.sign({ username, sub: userId }),
  });
}
