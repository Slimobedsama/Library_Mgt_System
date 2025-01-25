import ApiErrors from "../errors/ApiErrors.js";
import Book from "../models/book.js";

export const findAllBooks = async(query)=> {
    const { author, title } = query;
    let findBooks;
    
    if(author || title) {
        findBooks = await Book.find({ $or: [{ author }, { title }] });
        if(findBooks.length === 0) {
            throw ApiErrors.notFound('No books with the search parameter found')
        }
    } else {
        findBooks = await Book.find().sort({ author: 'asc' });
    }

    return findBooks;
}

export const findSingleBook = async(params)=> {
    const { id } = params;
    const findOneBook = await Book.findById(id);

    if(!findOneBook) {
        throw ApiErrors.notFound(`Book with id ${ id } not found...`);
    }
    return findOneBook;
}

export const bookCreation = async(body)=> {
    const { author, title, publishedYear, quantity, ISBN, isAvailable } = body;
    const newBook = await Book.create(body);
    return newBook;
}

export const delBook = async(params)=> {
    const { id } = params;
    const removeBook = await Book.findByIdAndDelete(id);
    
    if(!removeBook) {
        throw ApiErrors.notFound(`Book with id ${ id } not found...`);
    }

    return removeBook;
}