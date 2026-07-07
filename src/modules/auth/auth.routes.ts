import { Router } from "express";
import * as authController from "./auth.controller";
import validate from "../../middlewares/validate.middleware";
import { registerSchema, loginSchema } from "./auth.validation";
import { authenticate, authorize } from "../../middlewares/auth.middleware";

const router = Router();

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.get('/me', authenticate, authController.getMe);

export default router;