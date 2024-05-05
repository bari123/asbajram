import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from "../user/user.service";

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async login(users: any) {
    const user = await this.userService.findOneByUsername(users.username);
    if (user?.password !== users.password) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user._id, username: user.username };
    return {
      token: await this.jwtService.signAsync(payload),
    };
  }

  async signup(user) {
    return await this.userService.create(user);
  }
}
