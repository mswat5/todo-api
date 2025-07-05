import { Response } from 'express';
import { AuthRequest } from '../types';
export declare const createTodo: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getTodos: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getTodoById: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updateTodo: (req: AuthRequest, res: Response) => Promise<void>;
export declare const deleteTodo: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=todoController.d.ts.map