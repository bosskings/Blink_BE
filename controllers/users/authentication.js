import UserModel from "../../models/User.js";
import sendEmail from "../../utils/sendmail.js";

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

            // save to database
            const user = await UserModel.create(req.body);
            res.status(201).json({user});  
            
            // send users verification email 
            sendEmail(email,"TEsting 1,2,3", "REGISTRATION..");
            

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