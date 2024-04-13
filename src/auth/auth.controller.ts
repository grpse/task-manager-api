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
import { AuthedUserModel } from './models/authed-user.model';
import { PRISMA_ERROR_CODE_UNIQUE_CONSTRAINT_ON_FIELD } from '@/prisma.constants';
import { ApiBody } from '@nestjs/swagger';

@Controller('/')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiBody({
    description: 'The user credentials',
    schema: {
      type: 'object',
      properties: {
        username: {
          type: 'string',
        },
        password: {
          type: 'string',
        },
      },
    },
  })
  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Body() dto: AuthedUserModel) {
    return this.authService.login(dto);
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
