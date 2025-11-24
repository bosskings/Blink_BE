import jwt from "jsonwebtoken";
import UserModel from "../../models/User.js";
import sendEmail from "../../utils/sendmail.js";
import bcrypt from "bcrypt";



// get all users
const register = async(req, res)=>{
    try {

        let {email, password, phone} = req.body;
        
        if (!email || !password || !phone) {
            return res.status(400).json({ status:"FAILED",
                message: "Email, password, and phone are required."
            });

        }else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({
                status:"FAILED",
                message: "Please provide a valid email address."
            });
        
        }else{

            // hash password
            const saltRounds = 10;
            bcrypt.hash(password, saltRounds, async (err, hash) => {
                if (err) {
                    return res.status(500).json({ status:"FAILED", message: "Error hashing password." });
                }

                // Save to database with hashed password
                const userData = { ...req.body, password: hash };
                try {
                    const user = await UserModel.create(userData);
                    res.status(201).json({ status: "success", user });

                    // send users verification email 
                    sendEmail(email, "Welcome to Blink Africa, your account has been created successfully", "WELCOME TO BLINK");
                } catch (dbError) {
                    res.status(500).json({ status:"FAILED", message: dbError.message });
                }
            });
        }
    } catch (error) {
        res.status(500).json({message:error.message});    
    }
}





// confirm email
const sendEmailCode = async(req, res) => {

    // Create 4 random digits
    const code = Math.floor(1000 + Math.random() * 9000);
    const email = req.body.email;

    if(!email){
        return res.status(500).json({ status:"FAILED", message:"email is needed" })
    }

    try {
        await sendEmail(email, code, "EMAIL VERIFICATION");

        await UserModel.updateOne(
            { email: email },
            { $set: { emailVerificationStatus: code.toString() } }
        );

        res.status(201).json({ status: "success", code });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
    return;

}





// verify email code
const verifyEmailCode = async (req, res) => {

    const { email, code: inputCode } = req.body;

    if (!email || !inputCode) {
        return res.status(400).json({ status:"FAILED", message: "Email and code are required" });
    }

    // check if the inputted code is a match
    let user = await UserModel.findOne({ email: email });
    if (!user) {
        return res.status(404).json({ status: "error", message: "User not found" });
    }
    if (user.emailVerificationStatus !== inputCode.toString()) {
        return res.status(400).json({ status: "error", message: "Wrong code" });

    }else{
        // If code matches, set emailVerificationStatus to "VERIFIED"
        user = await UserModel.updateOne(
            { email: email }, 
            { $set: { emailVerificationStatus: "VERIFIED" } },
            { new: true }
        );
        return res.status(200).json({ status:"SUCCESS", user });
    }

    
}






// pseudo send user OTP to phone number for verification
const sendPhoneCode = async(req, res)=>{
    const {phone} = req.body;

    if(!phone){
        return res.status(500).json({
            status:"FAILED", 
            message:"Phone is required"
        })
    }

    return res.status(201).json({status:"SUCCESS", code:"0000"});
}





//pseudo confirm phone number using twillo
const verifyPhoneCode = async(req, res)=>{

    // for now, use 0000 as default verification code
    const { phone, code } = req.body;

    if (!phone || !code) {
        return res.status(400).json({ 
            status: "error", 
            message: "Phone and code are required" 
        });
    }

    let user = await UserModel.findOne({ phone: phone });
    if (!user) {
        return res.status(404).json({ status: "error", message: "User not found" });
    }

    if (code.toString() !== "0000") {
        return res.status(400).json({ status: "error", message: "Wrong code" });
    }

    user = await UserModel.findOneAndUpdate(
        { phone: phone },
        { $set: { phoneVerificationStatus: "VERIFIED" } },
        { new: true }
    );

    return res.status(200).json({ status: "success", user });
}





// function to collect remaining user details and save
const updateUsersDetails = async (req, res)=>{

    const {email, tag, bio, interests } = req.body;

    // Validate tag
    if (typeof tag !== 'string' || tag.length > 20 || !/^[a-zA-Z0-9.\-]+$/.test(tag)) {
        return res.status(400).json({ 
            status: "error", 
            message: "Invalid tag. Max 20 chars, only letters, numbers, '.', and '-' allowed." 
        });
    }

    // Validate bio
    if (typeof bio !== 'string' || bio.length > 100) {
        return res.status(400).json({ status: "error", message: "Bio must be a string of max 100 characters." });
    }

    // Validate interests
    if (!Array.isArray(interests)) {
        return res.status(400).json({ status: "error", message: "Interests must be an array." });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
        return res.status(404).json({ status: "error", message: "User not found." });
    }

    // Save extra fields to user
    user.tag = tag;
    user.bio = bio;
    user.interests = interests;
    await user.save();

    return res.status(200).json({ status: "success", user });

}



// login
const login = async (req, res) => {
    try {
        
        // get user inputs
        const {email, password} = req.body;
    
        // check availability of inputs
        if(!email && !password){
            throw new Error("all inputs required")
        }
    
        // check if users with inputted details exists in DB
        
        const user = await UserModel.findOne({ email});
        
        // check user exists with email
        if(!user){
            throw new Error("Wrong login detail_E")
        }
    
        if(!user.emailVerificationStatus == "VERIFIED"){
            throw new Error("Your Email is not yet verified")
        }
    
        // compare password
        const compare = await bcrypt.compare(password, user.password);
        
        if (!compare ) {
            throw new Error("Wrong login detail_P")
        } 
    
        // tokenize user id
        const token = jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: '36500d' }
        );
    
        return res.header('AUTH_TOKEN', token).status(200).json({
            status:"SUCCESS",
            token,
            data:user
        })

    } catch (error) {

        return res.status(500).json({
            status:"FAILED", 
            message:"an error occurred: "+error
        })
        
    }




}


// forgot password
const forgotPassword = (req, res) => {
    res.send('forgot password')
}





export {
    register,
    sendEmailCode,
    sendPhoneCode,
    verifyEmailCode,
    verifyPhoneCode,
    updateUsersDetails,
    forgotPassword,
    login,
}