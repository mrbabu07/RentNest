import { Router } from 'express';
import * as categoryController from './category.controller';
import validate from '../../middlewares/validate.middleware';
import { createCategorySchema } from './category.validation';
import { authenticate, authorize } from '../../middlewares/auth.middleware';

const router = Router();

// Public
router.get('/', categoryController.getAllCategories);

// Admin only
router.post(
  '/',
  authenticate,
  authorize('ADMIN'),
  validate(createCategorySchema),
  categoryController.createCategory
);

router.delete('/:id', authenticate, authorize('ADMIN'), categoryController.deleteCategory);

export default router;