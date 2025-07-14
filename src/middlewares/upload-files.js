import multer from 'multer';
import { TEMPLATE_UPLOAD_DIR } from '../constants/paths.js';



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, TEMPLATE_UPLOAD_DIR);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now();
        cb(null,uniqueSuffix + '-' + file.filename);
    }
});

export const upload = multer({ storage });
