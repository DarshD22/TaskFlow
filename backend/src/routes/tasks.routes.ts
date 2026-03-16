import { Router } from 'express';
import { body, param } from 'express-validator';
import {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  toggleTask,
} from '../controllers/tasks.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';

const router = Router();

// All task routes require auth
router.use(authenticate);

router.get('/', getTasks);

router.post(
  '/',
  [
    body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 255 }),
    body('description').optional().isString().isLength({ max: 2000 }),
    body('status')
      .optional()
      .isIn(['PENDING', 'IN_PROGRESS', 'COMPLETED'])
      .withMessage('Invalid status'),
    body('priority')
      .optional()
      .isIn(['LOW', 'MEDIUM', 'HIGH'])
      .withMessage('Invalid priority'),
    body('dueDate').optional().isISO8601().withMessage('Invalid date format'),
  ],
  validate,
  createTask
);

router.get(
  '/:id',
  [param('id').notEmpty().withMessage('Task ID is required')],
  validate,
  getTask
);

router.patch(
  '/:id',
  [
    param('id').notEmpty(),
    body('title').optional().trim().notEmpty().isLength({ max: 255 }),
    body('description').optional().isString().isLength({ max: 2000 }),
    body('status')
      .optional()
      .isIn(['PENDING', 'IN_PROGRESS', 'COMPLETED'])
      .withMessage('Invalid status'),
    body('priority')
      .optional()
      .isIn(['LOW', 'MEDIUM', 'HIGH'])
      .withMessage('Invalid priority'),
    body('dueDate').optional().isISO8601().withMessage('Invalid date format'),
  ],
  validate,
  updateTask
);

router.delete(
  '/:id',
  [param('id').notEmpty()],
  validate,
  deleteTask
);

router.post(
  '/:id/toggle',
  [param('id').notEmpty()],
  validate,
  toggleTask
);

export default router;