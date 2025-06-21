import createHttpError from 'http-errors';
import { ContactsBase } from './models/initMongoDB.js';

export const getContacts = async () => {
    const contacts = await ContactsBase.find();

    return contacts;
};
export const getContactById = async (contactId) => {
    const contact = await ContactsBase.findById(contactId);

    if (!contact) {
        throw createHttpError(404, 'Contact with id ${contactId} not found');
    }

    return contact;
};

export const createContact = async (payload) => {
    const contact = await ContactsBase.create(payload);
    return contact;
};

export const updateContact = async (contactId, payload, options) => {
    const result = await ContactsBase.findByIdAndUpdate(contactId, payload, {
        ...options,
        new: true,
        includeResultMetadata: true,
        runValidators: true,
    });
    if (!result.value) {
        throw createHttpError(404, 'Contact not found');
    }

    return {contact: result.value, isNew: !result.lastErrorObject.updatedExisting};
};

export const deleteContactById = async (contactId) => {
    await ContactsBase.findByIdAndDelete(contactId);
};
