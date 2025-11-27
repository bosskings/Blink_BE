import express from 'express';
import choseCommunity from '../controllers/users/choseCommunity.js';
import {
    register, 
    sendEmailCode, 
    verifyEmailCode, 
    sendPhoneCode,
    verifyPhoneCode,
    updateUsersDetails,
    forgotPassword, 
    login
} from "../controllers/users/authentication.js";
const router = express.Router();

// authentication routes
router.post('/register', register);
router.patch('/sendEmailCode', sendEmailCode);
router.patch('/verifyEmailCode', verifyEmailCode);
router.patch('/sendPhoneCode', sendPhoneCode);
router.patch('/verifyPhoneCode', verifyPhoneCode);
router.patch('/updateUsersDetails', updateUsersDetails);
router.post('/choseCommunity', choseCommunity);
router.post('/login', login);
router.post('/forgotPassword', forgotPassword);


export default router;