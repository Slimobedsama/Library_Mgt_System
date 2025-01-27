import ApiErrors from "../errors/ApiErrors.js";
import User from "../models/user.js";

export const getAllUsers = async function(query) {
    const { lastName, firstName } = query;
    let findAllUsers;

    if(lastName || firstName) {
        findAllUsers = await User.find({ $or:[{ lastName }, { firstName }]}).select(['lastName', 'firstName', 'address', 'phoneNumber']);
        if(findAllUsers.length === 0) {
            throw ApiErrors.notFound('Users with the search parameter not found');
        }
    } else {
        findAllUsers = await User.find().sort({ lastName: 'asc' }).select(['lastName', 'firstName', 'address', 'phoneNumber']);
    }

    return findAllUsers;
}

export const findOneUser = async function(params) {
    const { id } = params;
    const findSingleUser = await User.findById(id).select(['lastName', 'firstName', 'address', 'phoneNumber']);

    if(!findSingleUser) {
        throw ApiErrors.notFound(`User with id ${ id} not found`);
    }

    return findSingleUser;
}

export const signupUser = async function(body) {
    const { lastName, firstName, sex, address, phoneNumber, email } = body;
    const createUser = await User.create(body);

    return createUser;
}

export const updateUser = async function(params, body) {
    const { id } = params;
    const { address, phoneNumber } = body;
    const updateUserData = await User.findByIdAndUpdate(id, { address, phoneNumber }, { new: true });
    if(!updateUserData) {
        throw ApiErrors.notFound(`User with id ${id} not found`);
    }

    return updateUserData;
}

export const deleteUser = async function(params) {
    const { id } = params;
    const delUser = await User.findByIdAndDelete(id);

    if(!delUser) {
        throw ApiErrors.notFound(`User with id ${id} not found`);
    }
    
    return delUser;
}