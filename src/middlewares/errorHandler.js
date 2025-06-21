import { isHttpError } from 'http-errors';
import { MongooseError } from 'mongoose';

export const errorHandler = (error, req, res, next) => {
    if (isHttpError(error)) {
        return res.status(error.status).json({
            status: error.status,
            errorMessage: 'Something went wrong',
            id: req.id,
        });
    };

    if (error instanceof MongooseError) {
        return res.status(500).json({
            status: 500,
            errorMessage: 'MongoDB error',
            id: req.id,
            details: error.message,
        });
    }

    res.status(500).json({
        status: 500,
        errorMessage: 'Something went wrong',
        id: req.id,
    });
};
