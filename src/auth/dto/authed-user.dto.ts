import { User } from '@prisma/client';

export type AuthedUserDto = Omit<User, 'password'>;
