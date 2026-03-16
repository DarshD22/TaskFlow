import { Response, NextFunction } from 'express';
import { TaskStatus, Priority } from '@prisma/client';
import { prisma } from '../utils/prisma';
import { AppError } from '../middleware/error.middleware';
import {
  AuthenticatedRequest,
  CreateTaskBody,
  UpdateTaskBody,
  TaskQueryParams,
} from '../types';

export async function getTasks(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user!.userId;
    const {
      page = '1',
      limit = '10',
      status,
      priority,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query as TaskQueryParams;

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const where: Record<string, unknown> = { userId };

    if (status && Object.values(TaskStatus).includes(status)) {
      where.status = status;
    }
    if (priority && Object.values(Priority).includes(priority)) {
      where.priority = priority;
    }
    if (search && search.trim()) {
      where.title = { contains: search.trim(), mode: 'insensitive' };
    }

    const allowedSortFields = ['createdAt', 'updatedAt', 'title', 'dueDate', 'priority'];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';

    const [total, items] = await Promise.all([
      prisma.task.count({ where }),
      prisma.task.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { [sortField]: sortOrder },
      }),
    ]);

    const totalPages = Math.ceil(total / limitNum);

    res.json({
      success: true,
      data: {
        items,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages,
          hasNext: pageNum < totalPages,
          hasPrev: pageNum > 1,
        },
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function getTask(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    const userId = req.user!.userId;

    const task = await prisma.task.findFirst({ where: { id, userId } });
    if (!task) throw new AppError('Task not found', 404);

    res.json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
}

export async function createTask(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user!.userId;
    const { title, description, status, priority, dueDate } =
      req.body as CreateTaskBody;

    const task = await prisma.task.create({
      data: {
        title,
        description,
        status: status || TaskStatus.PENDING,
        priority: priority || Priority.MEDIUM,
        dueDate: dueDate ? new Date(dueDate) : null,
        userId,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: task,
    });
  } catch (err) {
    next(err);
  }
}

export async function updateTask(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    const userId = req.user!.userId;
    const updates = req.body as UpdateTaskBody;

    const existing = await prisma.task.findFirst({ where: { id, userId } });
    if (!existing) throw new AppError('Task not found', 404);

    const task = await prisma.task.update({
      where: { id },
      data: {
        ...updates,
        dueDate: updates.dueDate ? new Date(updates.dueDate) : undefined,
      },
    });

    res.json({
      success: true,
      message: 'Task updated successfully',
      data: task,
    });
  } catch (err) {
    next(err);
  }
}

export async function deleteTask(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    const userId = req.user!.userId;

    const existing = await prisma.task.findFirst({ where: { id, userId } });
    if (!existing) throw new AppError('Task not found', 404);

    await prisma.task.delete({ where: { id } });

    res.json({ success: true, message: 'Task deleted successfully' });
  } catch (err) {
    next(err);
  }
}

export async function toggleTask(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    const userId = req.user!.userId;

    const existing = await prisma.task.findFirst({ where: { id, userId } });
    if (!existing) throw new AppError('Task not found', 404);

    const nextStatus =
      existing.status === TaskStatus.COMPLETED
        ? TaskStatus.PENDING
        : TaskStatus.COMPLETED;

    const task = await prisma.task.update({
      where: { id },
      data: { status: nextStatus },
    });

    res.json({
      success: true,
      message: `Task marked as ${nextStatus.toLowerCase().replace('_', ' ')}`,
      data: task,
    });
  } catch (err) {
    next(err);
  }
}