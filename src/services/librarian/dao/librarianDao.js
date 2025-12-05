import Librarian from '../model/librarian.js';

class LibrarianDao {
    constructor() {
        this.Librarian = Librarian;
    }
    static async getEmail(data) {
        return await Librarian.findOne({email: data});
    }

    static async allLibrian() {
        return await Librarian.find()
            .sort({ createdAt: -1 })
            .select(['lastName', 'firstName', 'phone', 'email']);
    }

    static async getOneLibrarian(id) {
        return await Librarian.findById(id)
            .select(['lastName', 'firstName', 'phone']);
    }

    static async removelibrarian(id) {
        return await Librarian.findByIdAndDelete(id);
    }

}

export default LibrarianDao;