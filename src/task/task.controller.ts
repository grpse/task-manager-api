import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
} from '@nestjs/common';
import { TaskService } from './task.service';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthedUser } from '@/auth/user.decorator';
import { AuthedUserModel } from '@/auth/models/authed-user.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskEntity } from './entities/task';
import { UpdateTaskDto } from './dto/update-task.dto';

const numberQuery = (defaultValue = 100) => ({
  transform: (value: string) => (value ? parseInt(value, 10) : defaultValue),
});

@ApiTags('Tasks')
@ApiBearerAuth()
@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @ApiResponse({
    status: 201,
    description: 'The task has been successfully created.',
    type: TaskEntity,
  })
  @Post()
  create(
    @AuthedUser() user: AuthedUserModel,
    @Body() createTaskDto: CreateTaskDto,
  ) {
    return this.taskService.create({
      description: createTaskDto.description,
      title: createTaskDto.title,
      userId: user.id,
    });
  }

  @ApiResponse({
    status: 200,
    description: 'The list of tasks for the current user',
    type: [TaskEntity],
  })
  @ApiQuery({
    name: 'limit',
    type: 'number',
    required: false,
    description: 'The number of tasks to return',
    example: 100,
  })
  @ApiQuery({
    name: 'offset',
    type: 'number',
    required: false,
    description: 'The number of tasks to skip',
    example: 0,
  })
  @Get()
  findAll(
    @AuthedUser() user: AuthedUserModel,
    @Query('limit', numberQuery()) limit = 100,
    @Query('offset', numberQuery(0)) offset = 0,
  ) {
    return this.taskService.findAllForUser({
      userId: user.id,
      limit,
      offset,
    });
  }

  @ApiResponse({
    status: 201,
    description: 'Updated task',
    type: TaskEntity,
  })
  @ApiBadRequestResponse({
    description: 'Task was not found',
  })
  @ApiParam({
    name: 'taskId',
    type: 'string',
    required: true,
    description: 'The id of the task',
  })
  @Patch(':taskId')
  update(
    @AuthedUser() user: AuthedUserModel,
    @Param('taskId') taskId: string,
    @Body() updateTaskData: UpdateTaskDto,
  ) {
    return this.taskService.update({
      userId: user.id,
      taskId,
      ...updateTaskData,
    });
  }
}
