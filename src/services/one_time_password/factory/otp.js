import ApiErrors from "../../../errors/ApiErrors.js";
import OtpDao from "../dao/otp.js";

async function createOtpFactory(email) {
    await OtpDao.deleteExistingOtp(email);
    const generateOtp = await OtpDao.createOtp(email);

    if(!generateOtp) return false;

    return { generateOtp };
}

async function verifyOtpFactory(otp) {
    const verifyOtp = await OtpDao.isValidOtp(otp);

    if(!verifyOtp) {
        throw ApiErrors.notFound('Invalid otp');
    }

    return { verifyOtp };
}

export { createOtpFactory, verifyOtpFactory };