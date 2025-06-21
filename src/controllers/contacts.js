import { createContact, deleteContactById, getContactById, getContacts, updateContact } from '../services/contacts.js';

export const getContactsController = async (req, res) => {
    const contacts = await getContacts();

    res.json({
        message: 'Successfully get contacts',
        status: 200,
        data: contacts,
    });
};

export const getContactByIdController = async (req, res, next) => {
    const { contactId } = req.params;

    const contact = await getContactById(contactId);

    res.json({
        message: `Successfully get contact with id ${contactId}`,
        status: 200,
        data: contact,
    });
};

export const createContactsController = async (req, res) => {
    const contact = await createContact(req.body);

    return res.json({
        message: `Successfully created`,
        status: 201,
        data: contact,
    });
};

export const patchContactByIdController = async (req, res) => {
    const {contactId} = req.params;
    const { contact } = await updateContact(contactId, req.body, {
        upsert: false,
    });

    return res.json({
        message: `Successfully updated contact with id ${contactId}`,
        status: 200,
        data: contact,
    });
};

export const putContactController = async (req, res) => {
    const {contactId} = req.params;
    const { contact, isNew } = await updateContact(contactId, req.body, {
        upsert:true,
    });

    const status = isNew ? 201 : 200;

    return res.status(status).json({
        message: `Successfully updated contact with id ${contactId}`,
        status,
        data: contact,
    });
};

export const deleteContactController = async (req, res, next) => {
    const { contactId } = req.params;

    await deleteContactById(contactId);

    res.status(204).send();
};
