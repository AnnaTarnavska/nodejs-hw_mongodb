import Joi from "joi";

export const resetPwdValidationSchema = Joi.object({
    token: Joi.string().required(),
    password: Joi.string().required().mim(6),

});
