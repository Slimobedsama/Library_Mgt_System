import Admin from "../model/admin.js";

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
}

export default AdminDao;