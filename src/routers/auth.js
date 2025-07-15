import { Router } from "express";
import { loginUserController, logoutUserController, refreshSessionController, registerUserController, requestResetPwdEmailController, resetPwdController } from "../controllers/auth.js";
import { validateBody } from "../middlewares/validateBody.js";
import { registerUserValidationSchema } from '../validation/register-validation-schema.js';
import { loginUserValidationSchema } from '../validation/login-validation-schema.js';
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { requestResetPwdValidationSchema } from "../validation/request-reset-pwd-validation.js";

const authRouter = Router();

authRouter.post('/auth/register',validateBody(registerUserValidationSchema), ctrlWrapper(registerUserController));
authRouter.post('/auth/login', validateBody(loginUserValidationSchema), ctrlWrapper(loginUserController));
authRouter.post('/auth/refresh', ctrlWrapper(refreshSessionController));
authRouter.post('/auth/logout', ctrlWrapper(logoutUserController));


authRouter.post('/auth/send-reset-email',validateBody(requestResetPwdValidationSchema), ctrlWrapper(requestResetPwdEmailController));
authRouter.post('/auth/reset-pwd',validateBody(requestResetPwdValidationSchema), ctrlWrapper(resetPwdController));

export default authRouter;
