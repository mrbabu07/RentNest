import { Router } from "express";
import * as adminController from './admin.controller';
import validate from "../../middlewares/validate.middleware";
import { updateUserStatusSchema } from "./admin.validation";
import { authenticate, authorize } from "../../middlewares/auth.middleware";

const router = Router();

router.use(authenticate, authorize('ADMIN'));

router.get('/stats', adminController.getDashboardStats);
router.get('/users', adminController.getAllUsers);
router.patch('/users/:id', validate(updateUserStatusSchema), adminController.updateUserStatus);
router.get('/properties', adminController.getAllProperties);
router.get('/rentals', adminController.getAllRentalRequests);

export default router;
