import { Controller, Post, UseGuards, Body } from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { Public } from 'src/public.decorator';
import { SignupDto } from './dto/signup.dto';
import { AuthedUserDto } from './dto/authed-user.dto';

@Controller('/')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Body() dto: AuthedUserDto) {
    return this.authService.login(dto);
  }

  @Public()
  @Post('/signup')
  async signup(@Body() dto: SignupDto) {
    const { username, password } = dto;
    const newUser = await this.authService.createUser(username, password);
    return newUser;
  }
}
