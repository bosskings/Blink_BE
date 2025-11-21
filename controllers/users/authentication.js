import UserModel from "../../models/User.js";
import sendEmail from "../../utils/sendmail.js";
import bcrypt from "bcrypt";

// get all users
const register = async(req, res)=>{
    try {

        let {email, password, phone} = req.body;
        
        if (!email || !password || !phone) {
            return res.status(400).json({
                message: "Email, password, and phone are required."
            });

        }else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({
                message: "Please provide a valid email address."
            });
        
        }else{

            // hash password
            const saltRounds = 10;
            bcrypt.hash(password, saltRounds, async (err, hash) => {
                if (err) {
                    return res.status(500).json({ message: "Error hashing password." });
                }

                // Save to database with hashed password
                const userData = { ...req.body, password: hash };
                try {
                    const user = await UserModel.create(userData);
                    res.status(201).json({ message: "success", user });

                    // send users verification email 
                    sendEmail(email, "Testing 1,2,3", "REGISTRATION..");
                } catch (dbError) {
                    res.status(500).json({ message: dbError.message });
                }
            });
            
            

        }

        
    } catch (error) {
        res.status(500).json({message:error.message});    
    }
}

// confirm email
const confirmEmail = (req, res) => {
    res.send('confirm email')
}

// forgot password
const forgotPassword = (req, res) => {
    res.send('forgot password')
}

// login
const login = (req, res) => {
    res.send(' log in')    
}




export {
    register,
    confirmEmail,
    forgotPassword,
    login,
}