import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';
import { UsersService } from '@/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@/prisma.service';

describe('auth > AuthController >', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        JwtService,
        UsersService,
        LocalStrategy,
        JwtStrategy,
        PrismaService,
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('should signup and account and login', () => {
    const signupDto = { username: 'test', password: '123' };
    const loginDto = { username: 'test', password: '123' };
    const authedUserDto = { username: 'test', accessToken: '123' };

    it('should signup', async () => {
      const result = await controller.signup(signupDto);
      expect(result).toEqual(expect.objectContaining(authedUserDto));
    });

    it('should login', async () => {
      const user = await authService.validateUser(
        loginDto.username,
        loginDto.password,
      );
      const result = await controller.login(user);
      expect(result).toEqual(expect.objectContaining(authedUserDto));
    });
  });
});
