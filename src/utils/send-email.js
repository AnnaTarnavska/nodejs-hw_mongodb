import { createTransport } from "nodemailer";
import { getEnvVar } from "./getEnvVar";
import createHttpError from "http-errors";

const mailClient = createTransport({
    host: getEnvVar('SMTP_HOST'),
    port: getEnvVar('SMTP_PORT'),
    auth: {
        user: getEnvVar('SMTP_USER'),
        pass: getEnvVar('SMTP_PASSWORD'),
    },
});


export const sendEmail = async ({email, html, subject}) => {
    try {
        await mailClient.sendMail({
            to: email,
            html,
            subject,
            from: getEnvVar('SMTP_FROM'),
        });
    } catch (err) {
        console.error(err);
        throw createHttpError(500, 'Failed to send the email, please try again later.');
    }
};
