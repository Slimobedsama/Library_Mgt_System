import nodemailer from 'nodemailer';
import logger from '../logger.js';

const emailSender = async(info)=> {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            auth: {
                user: process.env.MAIL_USERNAME,
                pass: process.env.MAIL_PASS,
            }
        });
        const userInfo = await transporter.sendMail(info);
        logger.info(`Email sent ${userInfo.messageId}`);
    } catch (err) {
        logger.error(err.message)
    }
}

export default emailSender;