"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTodo = exports.updateTodo = exports.getTodoById = exports.getTodos = exports.createTodo = void 0;
const joi_1 = __importDefault(require("joi"));
const client_1 = __importDefault(require("../prisma/client"));
const createTodoSchema = joi_1.default.object({
    title: joi_1.default.string().min(1).max(255).required(),
    description: joi_1.default.string().max(1000).optional(),
    dueDate: joi_1.default.date().optional()
});
const updateTodoSchema = joi_1.default.object({
    title: joi_1.default.string().min(1).max(255).optional(),
    description: joi_1.default.string().max(1000).optional(),
    completed: joi_1.default.boolean().optional(),
    dueDate: joi_1.default.date().optional()
});
const createTodo = async (req, res) => {
    try {
        const { error, value } = createTodoSchema.validate(req.body);
        if (error) {
            res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: error.details.map(detail => detail.message)
            });
        }
        const { title, description, dueDate } = value;
        const userId = req.user.userId;
        const todo = await client_1.default.todo.create({
            data: {
                title,
                description,
                dueDate,
                userId
            }
        });
        const response = {
            success: true,
            message: 'Todo created successfully',
            data: todo
        };
        res.status(201).json(response);
    }
    catch (error) {
        console.error('Create todo error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
exports.createTodo = createTodo;
const getTodos = async (req, res) => {
    try {
        const userId = req.user.userId;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const [todos, total] = await Promise.all([
            client_1.default.todo.findMany({
                where: { userId },
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' }
            }),
            client_1.default.todo.count({ where: { userId } })
        ]);
        const response = {
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
    }
    catch (error) {
        console.error('Get todos error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
exports.getTodos = getTodos;
const getTodoById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;
        const todo = await client_1.default.todo.findFirst({
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
        const response = {
            success: true,
            message: 'Todo retrieved successfully',
            data: todo
        };
        res.status(200).json(response);
    }
    catch (error) {
        console.error('Get todo by id error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
exports.getTodoById = getTodoById;
const updateTodo = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;
        const { error, value } = updateTodoSchema.validate(req.body);
        if (error) {
            res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: error.details.map(detail => detail.message)
            });
        }
        const updateData = value;
        const existingTodo = await client_1.default.todo.findFirst({
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
        const updatedTodo = await client_1.default.todo.update({
            where: { id },
            data: updateData
        });
        const response = {
            success: true,
            message: 'Todo updated successfully',
            data: updatedTodo
        };
        res.status(200).json(response);
    }
    catch (error) {
        console.error('Update todo error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
exports.updateTodo = updateTodo;
const deleteTodo = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;
        const existingTodo = await client_1.default.todo.findFirst({
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
        await client_1.default.todo.delete({
            where: { id }
        });
        const response = {
            success: true,
            message: 'Todo deleted successfully'
        };
        res.status(200).json(response);
    }
    catch (error) {
        console.error('Delete todo error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
exports.deleteTodo = deleteTodo;
//# sourceMappingURL=todoController.js.map