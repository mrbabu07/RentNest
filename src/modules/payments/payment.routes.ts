import { Router } from 'express';
import * as paymentController from './payment.controller';
import validate from '../../middlewares/validate.middleware';
import { createPaymentSchema } from './payment.validation';
import { authenticate, authorize } from '../../middlewares/auth.middleware';

const router = Router();

router.post(
  '/',
  authenticate,
  authorize('TENANT'),
  validate(createPaymentSchema),
  paymentController.createPayment
);

router.get('/', authenticate, authorize('TENANT'), paymentController.getMyPayments);

router.get('/:id', authenticate, paymentController.getPaymentById);

export default router;