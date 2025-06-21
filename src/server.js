import express, {json} from 'express';
import cors from 'cors';
import pino from 'pino-http';
import { getEnvVar } from './utils/getEnvVar.js';
import contactsRouter from './routers/contacts.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { requestIdMiddleware } from './middlewares/requestIdMiddleware.js';
import { errorHandler } from './middlewares/errorHandler.js';

const PORT = Number(getEnvVar('PORT', '3000'));


export const setupServer = () => {
    const app = express();

    app.use(cors());
    app.use(pino({
        transport: {
          target: 'pino-pretty',
        },
    }),
    );

    app.use(json());

    app.use(requestIdMiddleware);
    app.use(contactsRouter);
    app.use(errorHandler);
    app.use(notFoundHandler);

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });

};
