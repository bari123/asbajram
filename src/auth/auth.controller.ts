import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  login(@Body() user: { username: string; password: string })  {
    return this.authService.login(user);
  }

  @Post('signup')
  signup(@Body() user: { username: string; password: string }) {
    return this.authService.signup(user);
  }
}
