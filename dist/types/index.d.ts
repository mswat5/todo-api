import { Request } from 'express';
export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
    errors?: any[];
}
export interface AuthRequest extends Request {
    user?: {
        userId: string;
        email: string;
    };
}
export interface CreateUserData {
    email: string;
    password: string;
    name?: string;
}
export interface LoginData {
    email: string;
    password: string;
}
export interface CreateTodoData {
    title: string;
    description?: string;
    dueDate?: Date;
}
export interface UpdateTodoData {
    title?: string;
    description?: string;
    completed?: boolean;
    dueDate?: Date;
}
export interface ErrorResponse {
    success: false;
    message: string;
    errors?: any[];
}
//# sourceMappingURL=index.d.ts.map