import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import { randomUUID } from 'node:crypto';
import { getEnvVar } from './utils/getEnvVar.js';
import { ContactsBase } from './models/initMongoDB.js';

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

    app.use((req, res, next) => {
        req.id = randomUUID();
        next();
    });

    app.get('/contacts', async (req, res) => {
        const data = await ContactsBase.find();
        res.json({
            message: 'Successfully get contacts',
            status: 200,
            data,
        });
    });

    app.get('/contacts/:contactId', async (req, res, next) => {
        const { contactId } = req.params;
        const contact = await ContactsBase.findById(contactId);

        if (!contact) {
            return res.status(404).json({
                message: `Contact with id ${contactId} not found`,
                status: 404,
            });
        }

        res.json({
            message:`Successfully get contact with id ${contactId}`,
            status: 200,
            data: contact,
        });
    });

    app.use((error, req, res, next) => {
        res.json({
          errorMessage: error.message,
          id: req.id,
        });
      });

      app.use((req, res) => {
        res.status(404).json({
          message: 'Not Found',
          status: 404,
        });
      });


    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });

};
