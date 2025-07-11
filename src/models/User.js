import { model, Schema } from 'mongoose';

const UserSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
     }
);

UserSchema.methods.toJSON = function () {
    const user = this.toObject();

    delete user.password;

    return user;
};

export const User = model('user', UserSchema);
