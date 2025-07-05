import { Response } from 'express';
import Joi from 'joi';
import prisma from '../prisma/client';
import { AuthRequest, CreateTodoData, UpdateTodoData, ApiResponse } from '../types';

// Validation schemas
const createTodoSchema = Joi.object({
  title: Joi.string().min(1).max(255).required(),
  description: Joi.string().max(1000).optional(),
  dueDate: Joi.date().optional()
});

const updateTodoSchema = Joi.object({
  title: Joi.string().min(1).max(255).optional(),
  description: Joi.string().max(1000).optional(),
  completed: Joi.boolean().optional(),
  dueDate: Joi.date().optional()
});

export const createTodo = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { error, value } = createTodoSchema.validate(req.body);
    if (error) {
      res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(detail => detail.message)
      });
    }

    const { title, description, dueDate }: CreateTodoData = value;
    const userId = req.user!.userId;

    const todo = await prisma.todo.create({
      data: {
        title,
        description,
        dueDate,
        userId
      }
    });

    const response: ApiResponse = {
      success: true,
      message: 'Todo created successfully',
      data: todo
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('Create todo error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const getTodos = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const [todos, total] = await Promise.all([
      prisma.todo.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.todo.count({ where: { userId } })
    ]);

    const response: ApiResponse = {
      success: true,
      message: 'Todos retrieved successfully',
      data: {
        todos,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Get todos error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const getTodoById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user!.userId;

    const todo = await prisma.todo.findFirst({
      where: {
        id,
        userId
      }
    });

    if (!todo) {
      res.status(404).json({
        success: false,
        message: 'Todo not found'
      });
    }

    const response: ApiResponse = {
      success: true,
      message: 'Todo retrieved successfully',
      data: todo
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Get todo by id error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const updateTodo = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user!.userId;

    const { error, value } = updateTodoSchema.validate(req.body);
    if (error) {
      res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(detail => detail.message)
      });
    }

    const updateData: UpdateTodoData = value;

    // Check if todo exists and belongs to user
    const existingTodo = await prisma.todo.findFirst({
      where: {
        id,
        userId
      }
    });

    if (!existingTodo) {
      res.status(404).json({
        success: false,
        message: 'Todo not found'
      });
    }

    const updatedTodo = await prisma.todo.update({
      where: { id },
      data: updateData
    });

    const response: ApiResponse = {
      success: true,
      message: 'Todo updated successfully',
      data: updatedTodo
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Update todo error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const deleteTodo = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user!.userId;

    // Check if todo exists and belongs to user
    const existingTodo = await prisma.todo.findFirst({
      where: {
        id,
        userId
      }
    });

    if (!existingTodo) {
      res.status(404).json({
        success: false,
        message: 'Todo not found'
      });
    }

    await prisma.todo.delete({
      where: { id }
    });

    const response: ApiResponse = {
      success: true,
      message: 'Todo deleted successfully'
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Delete todo error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};