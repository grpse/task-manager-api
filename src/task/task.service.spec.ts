import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';
import { TaskModule } from './task.module';
import { UsersService } from '@/users/users.service';
import { randomString } from 'test/utils/randomString';
import { DbModule } from '@/db.module';

describe('tasks > TaskService > integration >', () => {
  let service: TaskService;
  let userService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
      imports: [TaskModule, DbModule],
    }).compile();

    service = module.get<TaskService>(TaskService);
    userService = module.get<UsersService>(UsersService);
  });

  const createNewUser = () => {
    const username = randomString();
    const hashedPassword = randomString();
    return userService.create({ username, hashedPassword });
  };

  it('should call findAll and return create tasks by the user', async () => {
    const user = await createNewUser();
    await service.create({
      title: 'Test Task',
      description: 'Test Description',
      userId: user.id,
    });
    const result = await service.findAllForUser({ userId: user.id });
    expect(result).toEqual([
      expect.objectContaining({
        title: 'Test Task',
        description: 'Test Description',
      }),
    ]);
  });

  it('should call findAll and return an empty array', async () => {
    const user = await createNewUser();
    const result = await service.findAllForUser({ userId: user.id });
    expect(result).toEqual([]);
  });

  it('should call create and return a created task', async () => {
    const user = await createNewUser();
    const taskData = { title: 'Test Task', description: 'Test Description' };
    const taskCreated = await service.create({
      ...taskData,
      userId: user.id,
    });
    expect(taskCreated).toEqual(expect.objectContaining({ ...taskData }));
  });

  it('should call update and return the updated task', async () => {
    const user = await createNewUser();
    const taskData = { title: 'Test Task', description: 'Test Description' };
    const createdTask = await service.create({
      ...taskData,
      userId: user.id,
    });
    const updateTask = { title: 'Updated Test Task' };
    const result = await service.update({
      ...updateTask,
      userId: user.id,
      taskId: createdTask.id,
    });
    expect(result).toEqual(expect.objectContaining({ ...updateTask }));
  });
});
