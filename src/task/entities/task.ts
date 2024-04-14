import { ApiProperty } from '@nestjs/swagger';
import { Task, TaskStatus } from '@prisma/client';

export class TaskEntity implements Omit<Task, 'user_id'> {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  status: TaskStatus;
}
