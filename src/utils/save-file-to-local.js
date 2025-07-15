import fs from 'node:fs/promises';
import path from 'node:path';
import { getEnvVar } from "./getEnvVar";
import { PERMANENT_UPLOAD_DIR } from "../constants/paths.js";
import createHttpError from 'http-errors';

export const saveFileToLocal = async (file) => {
    try {
        const newPath = path.join(PERMANENT_UPLOAD_DIR, file.filename);
        await fs.rename(file.path, newPath);
        const url = `${getEnvVar('BACKEND_DOMAIN')}/uploads/${file.filename}`;
        return url;

    } catch (err) {
        console.error(err);
        throw createHttpError(500, 'Failed to upload image to local');

    }

};
