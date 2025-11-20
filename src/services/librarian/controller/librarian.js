import { deleteLibrarian, getAllLibrarian, getSingleLibrarian, signInLibrarian, signupLibrarian, updateLibrarian, librarianForgotPasswd, librarianPassReset } from '../factory/librarian.js';
import { EXPIRES, RESET } from '../../../utils/maxAge.js';
import tryCatch from '../../../utils/tryCatch.js';

export const getEveryLibrarian = tryCatch(async(req, res)=> {
        const allLibrarian = await getAllLibrarian();
        return res.status(200).json(allLibrarian);
});

export const getOneLibrarian = tryCatch(async(req, res)=> {
    const singleLibrarian = await getSingleLibrarian(req.params);
    return res.status(200).json({ message: 'Librarian found', data: singleLibrarian });
});

export const reqisterLibrarian = tryCatch(async(req, res)=> {
    const { createLibrarian, token } = await signupLibrarian(req.body);
    res.cookie('lib', token, {httpOnly: true, maxAge: EXPIRES});
    return res.status(201).json({message: 'Successful Creation', Librarian: createLibrarian._id});
});


export const accessLibrarian = tryCatch(async(req, res)=> {
    const { checkEmail, token } = await signInLibrarian(req.body);
    res.cookie('lib', token, {httpOnly: true, maxAge: EXPIRES});
    return res.status(200).json({message: 'Successful Login', Librarian: checkEmail._id});
});

export const modifyLabrarian = tryCatch(async(req, res)=> {
    const updateData = await updateLibrarian(req.body, req.params);
    return res.status(201).json({message: 'Update Successful', updateData});
});

export const removeLibrarian = tryCatch(async(req, res)=> {
    const delLibrarian = await deleteLibrarian(req.params);
    res.status(200).json({ message: 'Librarian deleted...', delLib: delLibrarian._id });
});

export const librarianLostPassword = tryCatch(async(req, res)=> {
    const { librarianId, resetToken } = await librarianForgotPasswd(req.body)
    res.cookie('reset', resetToken, { httpOnly: true, maxAge: RESET});
    return res.status(200).json({ message:'Check your mail for reset link', librarianId });
});

export const librarianResetPass = tryCatch(async(req, res)=> {
    const findId = await librarianPassReset(req.body, req.params, req.cookies);
    res.status(201).json({ message: 'Password Reset Successful', Librarian: findId._id });
});