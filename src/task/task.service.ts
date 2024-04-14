import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma.service';
import { TaskStatus } from '@prisma/client';

interface CreateTaskParams {
  title: string;
  description: string;
  userId: string;
}

interface UpdateTaskParams {
  userId: string;
  taskId: string;
  title?: string;
  description?: string;
  status?: TaskStatus;
}

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  create(createTaskDto: CreateTaskParams) {
    return this.prisma.task.create({
      data: {
        title: createTaskDto.title,
        description: createTaskDto.description,
        status: TaskStatus.To_do,
        user: {
          connect: {
            id: createTaskDto.userId,
          },
        },
      },
    });
  }

  findAllForUser({
    userId,
    limit = 100,
    offset = 0,
  }: {
    userId: string;
    limit?: number;
    offset?: number;
  }) {
    return this.prisma.task.findMany({
      where: {
        user_id: userId,
      },
      take: limit,
      skip: offset,
    });
  }

  async update({
    userId,
    taskId,
    title,
    description,
    status,
  }: UpdateTaskParams) {
    const task = await this.prisma.task.update({
      where: { id: taskId, user_id: userId },
      data: {
        title,
        description,
        status,
      },
    });

    if (!task) {
      throw new BadRequestException(`Task with id ${taskId} not found`);
    }

    return task;
  }
}
