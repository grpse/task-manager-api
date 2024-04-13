import { Module } from '@nestjs/common';
import { TaskModule } from './task/task.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DbModule } from './db.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@Module({
  imports: [TaskModule, AuthModule, UsersModule, DbModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
