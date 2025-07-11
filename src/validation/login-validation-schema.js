import Joi from "joi";

export const loginUserValidationSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().regex().min(6).required(),
});
