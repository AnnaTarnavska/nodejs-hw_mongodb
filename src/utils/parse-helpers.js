import { contactTypes } from "../constants/contactTypes.js";

const parseNumber = (value, defaultValue) => {
    const parsed = Number.parseInt(value);
    if (Number.isNaN(parsed)) {
        return defaultValue;
    }
    return parsed;
};
export const parsePaginationParams = (obj) => {

    return {
        page: parseNumber(obj.page, 1),
        perPage: parseNumber(obj.perPage, 10),
    };

};

const parseSortOrder = (value) => {
    if (['asc', 'desc'].includes(value)) {
        return value;
    }
    return 'asc';
};

const parseSortBy = (value) => {
    if (['name', 'phoneNumber', 'email', 'isFavourite'].includes(value)) {
        return value;
    }
    return '_id';
};

export const parseSortParams = (obj) => {
    return {
        sortOrder: parseSortOrder(obj.sortOrder),
        sortBy: parseSortBy(obj.sortBy),
    };
};

const parseContactType = (value) => {
    if (Object.values(contactTypes).includes(value))
        return value;
};

const parseBoolean = (value) => {
    if (['true', 'false'].includes(value))
        return JSON.parse(value);
};

export const parseFilters = (obj) => {
    return {
        contactType:parseContactType(obj.contactType),
        isFavourite: parseBoolean(obj.isFavourite),
    };
 };
