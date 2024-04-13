import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthedUserDto } from './dto/authed-user.dto';

export const AuthedUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): AuthedUserDto => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
