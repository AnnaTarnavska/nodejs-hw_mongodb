import createHttpError from 'http-errors';
import { createContact, deleteContactById, getContactById, getContacts, updateContact } from '../services/contacts.js';
import { parsePaginationParams, parseFilters, parseSortParams } from '../utils/parse-helpers.js';


export const getContactsController = async (req, res) => {
    const { page, perPage } = parsePaginationParams(req.query);
    const { sortBy, sortOrder } = parseSortParams(req.query);
    const filters = parseFilters(req.query);
    filters.userId = req.user._id;
    const {contacts, ...pagination} = await getContacts({
        page,
        perPage,
        sortBy,
        sortOrder,
        filters,
    });

    res.json({
        message: 'Successfully get contacts',
        status: 200,
        data: {
            data: contacts,
            ...pagination
        },
    });
};

export const getContactByIdController = async (req, res, next) => {
    const { contactId } = req.params;

    const contact = await getContactById(contactId, req.user._id);

    res.json({
        message: `Successfully get contact with id ${contactId}`,
        status: 200,
        data: contact,
    });
};

export const createContactsController = async (req, res) => {
    const contact = await createContact({
        ...req.body,
        userId: req.user._id,
    });

    return res.json({
        message: `Successfully created`,
        status: 201,
        data: contact,
    });
};

export const patchContactByIdController = async (req, res) => {
    const {contactId} = req.params;
    const { contact } = await updateContact(contactId, req.body, req.user._id,
        {
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
    const { contact, isNew } = await updateContact(contactId, req.body, req.user._id,
        {
            upsert: true,
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

    const contact = await deleteContactById(contactId, req.user._id);

    if (!contact) {
        next(createHttpError(404, 'Contact not found'));
        return;
    }

    res.status(204).send();
};
