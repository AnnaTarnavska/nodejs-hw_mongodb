import createHttpError from "http-errors";
import bcrypt from 'bcrypt';
import { User } from '../models/User.js';
import { Session } from '../models/Session.js';


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
