import fs from 'node:fs/promises';
import path from 'node:path';
import createHttpError from 'http-errors';
import { getEnvVar } from "./getEnvVar.js";
import { PERMANENT_UPLOAD_DIR } from "../constants/paths.js";

export const saveFileToLocal = async (file) => {
    try {
        const newPath = path.join(PERMANENT_UPLOAD_DIR, file.filename);
        await fs.rename(file.path, newPath);
        const url = `${getEnvVar('APP_DOMAIN')}/uploads/${file.filename}`;
        return url;

    } catch (err) {
        console.error(err);
        throw createHttpError(500, 'Failed to upload image to local');

    }

};
