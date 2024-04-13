import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthedUserModel } from './models/authed-user.model';

export const AuthedUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): AuthedUserModel => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
