
import { model, Schema } from 'mongoose';
import { User } from './User.js';

const contactSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        phoneNumber: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            trim: true,
        },
        isFavourite: {
            type: Boolean,
            default: false,
        },
        contactType: {
            type: String,
            enum: ['work', 'home', 'personal'],
            default: 'personal',
            required: true,
        },
        userId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: User,
        },
        photo: {
            type: String,
            required: false,
        },
    },
    {
        timestamps: true,
        versionKey: false,
     }
);


export const ContactsBase = model('contacts', contactSchema);
