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
            .sort({ lastName: 'asc' })
            .select(['lastName', 'firstName', 'phone']);
    }

    static async getOneLibrarian(id) {
        return await Librarian.findById(id)
            .select(['lastName', 'firstName', 'phone']);
    }

}

export default LibrarianDao;