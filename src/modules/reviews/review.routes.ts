import { Router } from 'express';
import * as reviewController from './review.controller';
import validate from '../../middlewares/validate.middleware';
import { createReviewSchema } from './review.validation';
import { authenticate, authorize } from '../../middlewares/auth.middleware';

const router = Router();

router.post(
  '/',
  authenticate,
  authorize('TENANT'),
  validate(createReviewSchema),
  reviewController.createReview
);

router.get('/property/:propertyId', reviewController.getPropertyReviews);

router.delete('/:id', authenticate, authorize('TENANT'), reviewController.deleteReview);

export default router;