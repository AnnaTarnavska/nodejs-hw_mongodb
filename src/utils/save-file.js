import createHttpError from "http-errors";
import { getEnvVar } from "./getEnvVar.js";
import { saveFileToCloudinary } from "./save-file-to-cloudinary.js";
import { saveFileToLocal } from "./save-file-to-local.js";


export const saveFile = async (file) => {

    if (getEnvVar('FILE_SAVING_STRATEGY') === 'cloudinary') {
        return await saveFileToCloudinary(file);
    } else if (getEnvVar('FILE_SAVING_STRATEGY') === 'local') {
        return saveFileToLocal(file);
    }

    throw createHttpError('Unknown storage policy');
};
