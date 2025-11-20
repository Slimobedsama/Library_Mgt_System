import Admin from "../model/admin.js";

class AdminDao {
    constructor() {
        this.Admin = Admin;
    }

    static async getEmail(email) {
        return await Admin.findOne({email});
    }

    static async update(id, data) {
        return await Admin.findByIdAndUpdate(
            id,
            { $set: data },
            { new: true }
        );
    }
}

export default AdminDao;