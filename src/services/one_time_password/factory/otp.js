import OtpDao from "../dao/otp.js";

async function createOtpFactory(email) {
    await OtpDao.deleteExistingOtp(email);
    const generateOtp = await OtpDao.createOtp(email);

    if(!generateOtp) return false;

    return { generateOtp };
}

export { createOtpFactory };