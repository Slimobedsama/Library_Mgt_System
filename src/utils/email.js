import nodemailer from 'nodemailer';

const emailSender = async(info)=> {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: true,
            auth: {
                user: process.env.USER_EMAIL,
                pass: process.env.EMAIL_PASS,
            }
        });
        const userInfo = await transporter.sendMail(info);
        console.log(`Email sent ${userInfo.messageId}`);
    } catch (err) {
        console.log(err.message)
    }
}

export default emailSender;