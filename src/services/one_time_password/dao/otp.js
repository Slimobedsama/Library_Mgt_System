import Otp from "../model/otp.js";

class OtpDao {
    constructor() {
        this.Otp = Otp;
    }

    async createOtp(email) {
        const otp = Math.floor(Math.random() * 900000) + 100000;
        return await this.Otp.create({ email, otp });
    }

    async deleteExistingOtp(email) {
        return await this.Otp.deleteMany({ email });
    }

    async isValidOtp(otp) {
        return await this.Otp.findOne({ otp });
    }
}

export default new OtpDao;