import { Router } from "express";
import { loginUserController, logoutUserController, refreshSessionController, registerUserController } from "../controllers/auth.js";
import { validateBody } from "../middlewares/validateBody.js";
import { registerUserValidationSchema } from '../validation/register-validation-schema.js';
import { loginUserValidationSchema } from '../validation/login-validation-schema.js';
import { ctrlWrapper } from "../utils/ctrlWrapper.js";

const authRouter = Router();

authRouter.post('/auth/register',validateBody(registerUserValidationSchema), ctrlWrapper(registerUserController));
authRouter.post('/auth/login', validateBody(loginUserValidationSchema), ctrlWrapper(loginUserController));
authRouter.post('/auth/refresh', ctrlWrapper(refreshSessionController));
authRouter.post('/auth/logout', ctrlWrapper(logoutUserController));

export default authRouter;
