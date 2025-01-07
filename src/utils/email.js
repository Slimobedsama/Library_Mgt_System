import nodemailer from 'nodemailer';

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
        console.log(`Email sent ${userInfo.messageId}`);
    } catch (err) {
        console.log(err.message)
    }
}

export default emailSender;