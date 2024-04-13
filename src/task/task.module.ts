import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { DbModule } from 'src/db.module';

@Module({
  controllers: [TaskController],
  providers: [TaskService],
  imports: [DbModule],
})
export class TaskModule {}
