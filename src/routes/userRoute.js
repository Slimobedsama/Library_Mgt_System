import express from 'express';
const Router = express.Router();
import { allUsers, getOneUser, registerUsers, modifyUser, removeUser } from '../controller/userController.js';
import { userSignupVal, userEditVal } from '../utils/userValidation.js';
import { librarianAuth } from '../middleware/auth.js';

Router.get('/', librarianAuth, allUsers);
Router.get('/:id', librarianAuth, getOneUser);
Router.post('/signup', librarianAuth, userSignupVal, registerUsers);
Router.patch('/:id', librarianAuth, userEditVal, modifyUser);
Router.delete('/:id', librarianAuth, removeUser);

export default Router;