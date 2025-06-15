import mongoose from "mongoose";
import { getEnvVar } from "../utils/getEnvVar.js";

export const initMongoConnection = async () => {
    const user = getEnvVar('MONGO_DB_USER');
    const password = getEnvVar('MONGO_DB_PASSWORD');
    const host = getEnvVar('MONGO_DB_HOST');
    const db = getEnvVar('MONGO_DB_DATABASE');
    const url = `mongodb+srv://${user}:${password}@${host}/${db}?retryWrites=true&w=majority&appName=Cluster0`;

    try {
        await mongoose.connect(url);
        // await mongoose.connection.db('contacts').command({ ping: 1 });
        console.log('Mongo connection successful!');
    } catch (error) {
        console.error('Mongo connection error', error);
    }
        // process.exit(1);
};
