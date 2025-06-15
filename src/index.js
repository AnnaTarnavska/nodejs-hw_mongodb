import { setupServer } from './server.js';
import { initMongoConnection } from './db/initMongoConnection.js';


const contactsApp = async () => {
    await initMongoConnection();
    setupServer();
};

contactsApp();

