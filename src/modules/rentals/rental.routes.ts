import { Router } from 'express';
import * as rentalController from './rental.controller';
import validate from '../../middlewares/validate.middleware';
import { createRentalRequestSchema, updateRentalStatusSchema } from './rental.validation';
import { authenticate, authorize } from '../../middlewares/auth.middleware';

const router = Router();

// Tenant creates a rental request
router.post(
  '/',
  authenticate,
  authorize('TENANT'),
  validate(createRentalRequestSchema),
  rentalController.createRentalRequest
);

// Tenant sees their own requests
router.get(
  '/my-requests',
  authenticate,
  authorize('TENANT'),
  rentalController.getMyRentalRequests
);

// Landlord sees requests for their properties
router.get(
  '/landlord-requests',
  authenticate,
  authorize('LANDLORD'),
  rentalController.getLandlordRentalRequests
);

// Get single request details (tenant or landlord involved)
router.get('/:id', authenticate, rentalController.getRentalRequestById);

// Landlord approves/rejects
router.patch(
  '/:id',
  authenticate,
  authorize('LANDLORD'),
  validate(updateRentalStatusSchema),
  rentalController.updateRentalRequestStatus
);

export default router;