import Joi from "joi";

export const requestResetPwdValidationSchema = Joi.object({
    email: Joi.string().email().required(),

});
