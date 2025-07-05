import { Router } from 'express';
import { verifyToken } from '../middleware/auth';
import {
  createTodo,
  getTodos,
  getTodoById,
  updateTodo,
  deleteTodo
} from '../controllers/todoController';

const router = Router();

// All todo routes require authentication
router.use(verifyToken);

router.post('/', createTodo);
router.get('/', getTodos);
router.get('/:id', getTodoById);
router.put('/:id', updateTodo);
router.delete('/:id', deleteTodo);

export default router;