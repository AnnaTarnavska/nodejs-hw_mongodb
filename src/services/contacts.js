import createHttpError from 'http-errors';
import { ContactsBase } from '../models/initMongoDB.js';
import { createPaginationMetadata } from '../utils/create-pagination-metadata.js';

export const getContacts = async ({page, perPage, sortOrder, sortBy, filters, }) => {
    const offset = (page - 1) * perPage;

    const contactFilterConditions = ContactsBase.find();
    if (filters.contactType) {
        contactFilterConditions.where('contactType').equals(filters.contactType);
    }

    if (typeof filters.isFavourite === 'boolean') {
        contactFilterConditions.where('isFavourite').equals(filters.isFavourite);
    }

    if ( filters.userId) {
        contactFilterConditions.where('userId').equals(filters.userId);
    }

    const [contacts, contactsCount] = await Promise.all([
        ContactsBase.find()
            .merge(contactFilterConditions)
            .skip(offset)
            .limit(perPage)
            .sort({
            [sortBy]: sortOrder,
        }),
        ContactsBase.find().merge(contactFilterConditions).countDocuments(),
    ]);

    const metadata = createPaginationMetadata(page, perPage, contactsCount);

    return {contacts, ...metadata};
};

export const getContactById = async (contactId, userId) => {
    const contact = await ContactsBase.findOne({_id: contactId, userId});

    if (!contact) {
        throw createHttpError(404, 'Contact with id ${contactId} not found');
    }

    return contact;
};

export const createContact = async (payload) => {
    const contact = await ContactsBase.create(payload);
    return contact;
};

export const updateContact = async (contactId, payload, userId, options) => {
    const result = await ContactsBase.findOneAndUpdate({_id: contactId, userId}, payload, {
        ...options,
        new: true,
        includeResultMetadata: true,
        runValidators: true,
    });
    if (!result?.value) {
        throw createHttpError(404, 'Contact not found');
    }

    return {contact: result.value, isNew: !result.lastErrorObject.updatedExisting};
};

export const deleteContactById = async (contactId, userId) => {
    const contact = await ContactsBase.findOneAndDelete({ _id: contactId, userId });
    if (!contact) {
        throw createHttpError(404, 'Contact not found');
    }
    return contact;
};
