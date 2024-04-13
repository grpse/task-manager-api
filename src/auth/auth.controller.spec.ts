import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';
import { UsersService } from '@/users/users.service';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from '@/prisma.service';
import { jwtConstants } from './constants';
import { UnauthorizedException } from '@nestjs/common';

describe('auth > AuthController >', () => {
  let controller: AuthController;
  let authService: AuthService;
  let localStrategy: LocalStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        UsersService,
        LocalStrategy,
        JwtStrategy,
        PrismaService,
      ],
      imports: [
        JwtModule.register({
          secret: jwtConstants.secret,
          signOptions: { expiresIn: '60s' },
        }),
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    localStrategy = module.get<LocalStrategy>(LocalStrategy);
  });

  it('should signup and account and login', async () => {
    const username = Math.random().toString(36).substring(7);
    const password = Math.random().toString(36).substring(7);

    const signup = await controller.signup({ username, password });
    const user = await authService.validateUser(username, password);
    const login = await controller.login(user);

    expect(signup).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        username,
      }),
    );
    expect(login).toEqual(
      expect.objectContaining({
        accessToken: expect.any(String),
      }),
    );
  });

  it('should fail to login with invalid password', async () => {
    const username = Math.random().toString(36).substring(7);
    const password = Math.random().toString(36).substring(7);

    await controller.signup({ username, password });

    await expect(
      localStrategy.validate(username, 'invalid password'),
    ).rejects.toThrow(UnauthorizedException);
  });
});
