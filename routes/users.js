import express from 'express';
import {register, confirmEmail, forgotPassword, login} from "../controllers/users/authentication.js";
const router = express.Router();

// authentication routes
router.post('/register', register);
router.post('/confirmEmail', confirmEmail);
router.post('/forgotPassword', forgotPassword);
router.post('/login', login);


export default router;