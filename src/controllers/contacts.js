import createHttpError from 'http-errors';
import { createContact, deleteContactById, getContactById, getContacts, updateContact } from '../services/contacts.js';
import { parsePaginationParams, parseFilters, parseSortParams } from '../utils/parse-helpers.js';


export const getContactsController = async (req, res) => {
    const { page, perPage } = parsePaginationParams(req.query);
    const { sortBy, sortOrder } = parseSortParams(req.query);
    const filters = parseFilters(req.query);
    const contacts = await getContacts({
        page,
        perPage,
        sortBy,
        sortOrder,
        filters,
    });

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

    const contact = await deleteContactById(contactId);
    if (!contact) {
        next(createHttpError(404, 'Contact not found'));
        return;
    }

    res.status(204).send();
};
