import Admin from "../model/admin.js";
import ApiErrors from "../../../errors/ApiErrors.js";
import bcrypt from 'bcrypt';

class AdminDao {
    constructor() {
        this.Admin = Admin;
    }

    static async getEmail(email) {
        return await Admin.findOne({email});
    }

    static async update(query, data) {
        return await Admin.findByIdAndUpdate(
            query,
            data,
            { new: true }
        );
    }
    
    static async login(email, password) {
        const confirmEmail = await AdminDao.getEmail(email);
        if(confirmEmail) {
            const checkPassword = await bcrypt.compare(password, confirmEmail.password);
            if(checkPassword) {
                return confirmEmail;
            }
            throw ApiErrors.notFound('Incorrect password');
            }
            throw ApiErrors.notFound('Email not found');
    }

}

export default AdminDao;