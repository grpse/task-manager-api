import {
  Controller,
  Post,
  UseGuards,
  Body,
  InternalServerErrorException,
} from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { Public } from '@/public.decorator';
import { SignupDto } from './dto/signup.dto';
import { PRISMA_ERROR_CODE_UNIQUE_CONSTRAINT_ON_FIELD } from '@/prisma.constants';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';

@ApiTags('Auth')
@Controller('/')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @ApiResponse({
    status: 201,
    description: 'Login successful.',
  })
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Body() login: LoginDto) {
    return this.authService.createAccessToken(login.username);
  }

  @Public()
  @Post('/signup')
  async signup(@Body() dto: SignupDto) {
    try {
      const { username, password } = dto;
      const newUser = await this.authService.createUser(username, password);
      return newUser;
    } catch (error) {
      if (error?.code === PRISMA_ERROR_CODE_UNIQUE_CONSTRAINT_ON_FIELD) {
        // Don't expose the reason of the error to the client
        throw new InternalServerErrorException();
      }
      throw error;
    }
  }
}
