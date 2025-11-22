import express from 'express';
import {
    register, 
    sendEmailCode, 
    verifyEmailCode, 
    sendPhoneCode,
    verifyPhoneCode,
    aboutUser,
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
router.patch('/aboutUser', aboutUser)
router.post('/forgotPassword', forgotPassword);
router.post('/login', login);


export default router;