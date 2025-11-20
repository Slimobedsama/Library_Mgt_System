import { deleteUser, findOneUser, getAllUsers, signupUser, updateUser } from '../factory/user.js';
import tryCatch from '../../../utils/tryCatch.js';

export const allUsers = tryCatch( async(req, res)=> {
    const findAllUsers = await getAllUsers(req.query);
    return res.status(200).json(findAllUsers);
});

export const registerUsers = tryCatch(async(req, res)=> {
    const createUser = await signupUser(req.body);
    return res.status(201).json({ message: 'Success', data: createUser });
});

export const getOneUser = tryCatch(async(req, res)=> {
    const findSingleUser = await findOneUser(req.params); 
    return res.status(200).json({message: 'User found', findSingleUser });
});

export const modifyUser = tryCatch(async(req, res)=> {
    const updateUserData = await updateUser(req.params, req.body);
    return res.status(201).json({ message: 'Update Successful', data: updateUserData });
});

export const removeUser = tryCatch(async(req, res)=> {
    const delUser = await deleteUser(req.params);
    return res.status(200).json({ message: 'User deleted...' });
})