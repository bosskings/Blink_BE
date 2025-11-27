import express from 'express';
import {communitiesNear} from '../controllers/users/communities.js';
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

//route to display current communities within a given range of the users current location
router.get('/communitiesNear', communitiesNear)
// router.post('/choseCommunity', choseCommunity);


router.post('/login', login);
router.post('/forgotPassword', forgotPassword);


export default router;