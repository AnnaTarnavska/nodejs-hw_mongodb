import { Router } from 'express';
import { createContactsController, deleteContactController, getContactByIdController, getContactsController, patchContactByIdController, putContactController } from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { isValidId } from '../middlewares/isValidId.js';
import { createValidationSchema } from '../validation/createValidationSchema.js';
import { validateBody } from '../middlewares/validateBody.js';
import { updateValidationSchema } from '../validation/updateValidationSchema.js';
import { authenticate } from '../middlewares/authenticate.js';

const contactsRouter = Router();

contactsRouter.use('/contacts', authenticate);

contactsRouter.use('/contacts/:contactId', isValidId('contactId'));

contactsRouter.get('/contacts', ctrlWrapper(getContactsController));
contactsRouter.get('/contacts/:contactId', ctrlWrapper(getContactByIdController));

contactsRouter.post('/contacts',validateBody(createValidationSchema), ctrlWrapper(createContactsController));
contactsRouter.patch('/contacts/:contactId', validateBody(updateValidationSchema), ctrlWrapper(patchContactByIdController));
contactsRouter.put('/contacts/:contactId',validateBody(createValidationSchema), ctrlWrapper(putContactController));
contactsRouter.delete('/contacts/:contactId', ctrlWrapper(deleteContactController));


export default contactsRouter;
