import express, {json} from 'express';
import cors from 'cors';
import pino from 'pino-http';
import { getEnvVar } from './utils/getEnvVar.js';
import contactsRouter from './routers/contacts.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { requestIdMiddleware } from './middlewares/requestIdMiddleware.js';
import { errorHandler } from './middlewares/errorHandler.js';
import cookieParser from 'cookie-parser';
import authRouter from './routers/auth.js';
import { PERMANENT_UPLOAD_DIR } from './constants/paths.js';
import { setupSwagger } from './middlewares/swagger.js';

const PORT = Number(getEnvVar('PORT', '3000'));


export const setupServer = () => {
    const app = express();

    app.use('/api-docs', setupSwagger());

    app.use(cors());
    app.use(pino({
        transport: {
          target: 'pino-pretty',
        },
    }),
    );

    app.use(cookieParser());

    app.use(json());

    app.use(requestIdMiddleware);
    app.use('uploads', express.static(PERMANENT_UPLOAD_DIR));
    app.use(contactsRouter);
    app.use(authRouter);
    app.use(errorHandler);
    app.use(notFoundHandler);

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });

};
