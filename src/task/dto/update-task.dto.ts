import { ApiProperty } from '@nestjs/swagger';
import { TaskStatus } from '@prisma/client';
import { IsEnum, IsOptional } from 'class-validator';

export class UpdateTaskDto {
  @ApiProperty({
    description: 'Title of the task',
  })
  @IsOptional()
  title?: string;

  @ApiProperty({
    description: 'Description of the task',
  })
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'The new status of the task',
    enum: TaskStatus,
    required: true,
    example: TaskStatus.In_progress,
  })
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;
}
