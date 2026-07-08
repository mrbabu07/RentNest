import { Router } from 'express';
import * as propertyController from './property.controller';
import validate from '../../middlewares/validate.middleware';
import { createPropertySchema, updatePropertySchema } from './property.validation';
import { authenticate, authorize } from '../../middlewares/auth.middleware';

const router = Router();

// Public routes
router.get('/', propertyController.getAllProperties);

// Landlord-only routes (must come BEFORE '/:id' to avoid conflict)
router.get(
  '/my-properties',
  authenticate,
  authorize('LANDLORD'),
  propertyController.getMyProperties
);

router.post(
  '/',
  authenticate,
  authorize('LANDLORD'),
  validate(createPropertySchema),
  propertyController.createProperty
);

router.get('/:id', propertyController.getPropertyById);

router.put(
  '/:id',
  authenticate,
  authorize('LANDLORD'),
  validate(updatePropertySchema),
  propertyController.updateProperty
);

router.delete(
  '/:id',
  authenticate,
  authorize('LANDLORD'),
  propertyController.deleteProperty
);

export default router;