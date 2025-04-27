import Librarian from '../model/librarian.js';

class LibrarianDao {
    constructor() {
        this.Librarian = Librarian;
    }
    static async getEmail(data) {
        return Librarian.findOne({email: data});
    }
}

export default LibrarianDao;