import { Router } from 'express';
import { createContactsController, deleteContactController, getContactByIdController, getContactsController, patchContactByIdController, putContactController } from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const contactsRouter = Router();

contactsRouter.get('/contacts', ctrlWrapper(getContactsController));
contactsRouter.get('/contacts/:contactId', ctrlWrapper(getContactByIdController));
contactsRouter.post('/contacts', ctrlWrapper(createContactsController));
contactsRouter.patch('/contacts/:contactId', ctrlWrapper(patchContactByIdController));
contactsRouter.put('/contacts/:contactId', ctrlWrapper(putContactController));
contactsRouter.delete('/contacts/:contactId', ctrlWrapper(deleteContactController));


export default contactsRouter;
