import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { TaskModule } from './task.module';
import { DbModule } from '@/db.module';
import { UsersService } from '@/users/users.service';
import { randomString } from 'test/utils/randomString';
import { TaskStatus } from '@prisma/client';

describe('tasks > TaskController > integration >', () => {
  let controller: TaskController;
  let usersService: UsersService;
  let tasksService: TaskService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
      imports: [TaskModule, DbModule],
    }).compile();

    controller = module.get<TaskController>(TaskController);
    usersService = module.get<UsersService>(UsersService);
    tasksService = module.get<TaskService>(TaskService);
  });

  const createNewUser = () => {
    const username = randomString();
    const hashedPassword = randomString();
    return usersService.create({ username, hashedPassword });
  };

  it('should create a task for the logged in user', async () => {
    const user = await createNewUser();
    const createTaskDto = {
      title: 'Test Title',
      description: 'Test Description',
    };
    const taskEntity = await controller.create(
      {
        id: user.id,
        username: user.username,
      },
      createTaskDto,
    );

    expect(taskEntity).toEqual(expect.objectContaining(createTaskDto));
  });

  it('should all tasks for the user', async () => {
    const user = await createNewUser();
    const createTaskDto = {
      title: 'Test Title',
      description: 'Test Description',
    };
    await tasksService.create({
      ...createTaskDto,
      userId: user.id,
    });

    const userTasks = await controller.findAll(user);

    expect(userTasks).toEqual(
      expect.arrayContaining([expect.objectContaining(createTaskDto)]),
    );
  });

  it('should update user tasks', async () => {
    const user = await createNewUser();
    const createTaskDto = {
      title: 'Test Title',
      description: 'Test Description',
    };
    const taskEntity = await tasksService.create({
      ...createTaskDto,
      userId: user.id,
    });

    const updateTaskDto = {
      title: 'Updated Test Title',
      description: 'Updated Test Description',
      status: TaskStatus.In_progress,
    };

    const updatedTask = await controller.update(
      user,
      taskEntity.id,
      updateTaskDto,
    );

    expect(updatedTask).toEqual(expect.objectContaining(updateTaskDto));
  });
});
