import Joi from "joi";

export const createValidationSchema = Joi.object({
    name: Joi.string().min(3).max(20).required(),
    phoneNumber: Joi.string().min(3).max(20),
    email: Joi.string().min(3).max(20).required(),
    isFavourite: Joi.boolean().default(false),
    contactType: Joi.string().valid('work', 'home', 'personal').default('personal'),
});
