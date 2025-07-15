import createHttpError from "http-errors";
import crypto from 'node:crypto';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Handlebars from 'handlebars';
import { User } from '../models/User.js';
import { Session } from '../models/Session.js';
import { sendEmail } from "../utils/send-email.js";
import { getEnvVar } from "../utils/getEnvVar.js";
import fs from 'node:fs';
import path from 'node:path';
import { TEMPLATE_DIR } from '../constants/paths.js';


const resetPwdTemplate = fs.readFileSync(path.join(TEMPLATE_DIR, 'reset-pwd-email-template.html')).toString();

const createSession = () => ({
    accessToken: crypto.randomBytes(30).toString('base64'),
        refreshToken: crypto.randomBytes(30).toString('base64'),
        accessTokenValidUntil: new Date(Date.now() + 1000 * 60 * 15),
        refreshTokenValidUntil: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
});

export const registerUser = async (payload) => {
    const existUser = await User.findOne({ email: payload.email });

    if (existUser) {
        throw createHttpError(409, 'Email in use');
    }

    const hashedPassword = await bcrypt.hash(payload.password, 10);

    const user = await User.create({...payload, password: hashedPassword,});

    return user;
};


export const loginUser = async (payload) => {
    const user = await User.findOne({ email: payload.email });

    if (!user) {
        throw createHttpError(401, 'User or password does not match!');
    }

    const arePasswordEqual = await bcrypt.compare(
        payload.password,
        user.password,
    );

    if (!arePasswordEqual) {
        throw createHttpError(401, 'User or password does not match!');
    };

    await Session.findOneAndDelete({ userId: user._id });

    const session = await Session.create({
        ...createSession(),
        userId: user._id,
    });

    return session;

};

export const logoutUser = async (sessionId, sessionToken) => {
    await Session.findOneAndDelete({
        _id: sessionId,
        refreshToken: sessionToken,
    });
};

export const refreshSession = async (sessionId, sessionToken) => {
    const session = await Session.findOne({
        _id: sessionId,
        refreshToken: sessionToken,
    });

    if (!session) {
        throw createHttpError(401, 'Session not found!');
    }

    if (session.refreshTokenValidUntil < new Date()) {
        throw createHttpError(401, 'Session expired!');
    }

    await Session.findOneAndDelete(sessionId);

    const newSession = await Session.create({
        ...createSession(),
        userId: session.userId,
    });

    return newSession;
};

export const requestResetPwdEmail = async (email) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw createHttpError(404, 'User not found!');
    }

    const token = jwt.sign({
        sub: user._id,
        email: user.email,
    },
        getEnvVar('JWT_SECRET'),
        {expiresIn: '5m'}
    );

    const template = Handlebars.compile(resetPwdTemplate);

    const html = template({
        name: user.name,
        link:`${getEnvVar('APP_DOMAIN')}/reset-password?token=${token}`,
    });

    await sendEmail({ email, html, subject: 'Reset your password' });
};

export const resetPwd = async ({ token, password }) => {
    let tokenPayload;

    try {
        tokenPayload = jwt.verify(token, getEnvVar('JWT_SECRET'));
    } catch (err) {
        console.log(err);
        throw createHttpError(401, 'Token is expired or invalid.');
    }
    const user = await User.findById(tokenPayload.sub);
    if (!user) {
        throw createHttpError(404, 'User not found!');
    }

    const hashedPwd = await bcrypt.hash(password, 10);

    await User.findByIdAndUpdate(tokenPayload.sub, { password: hashedPwd });
    await Session.findOneAndDelete({ userId: tokenPayload.sub });
};
