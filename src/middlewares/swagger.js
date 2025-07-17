import fs from 'node:fs';
import swaggerUi from 'swagger-ui-express';
import { SWAGGER_PATH } from '../constants/paths.js';
import createHttpError from 'http-errors';


export const setupSwagger = () => {
    try {
        const swaggerContent = JSON.parse(fs.readFileSync(SWAGGER_PATH).toString());
        return [...swaggerUi.serve, swaggerUi.setup(swaggerContent)];

    } catch (err) {
        console.log(err);
        return (req, res, next) => {
            next(createHttpError (500, "Can't load swagger"));
        };

    }
};

