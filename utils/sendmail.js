import nodemailer from "nodemailer";

const sendEmail = async(to, message, title) =>{
    

    const transporter = nodemailer.createTransport({
        service: "gmail",        
        host: "smtp.gmail.com",
        port: 587, // Standard port for secured SMTP
        secure: false, // Use TLS
        auth: {
            user: "blinkishyper@gmail.com",
            pass: process.env.EMAIL_PASSWORD 
        }
    });
    
    const mailOptions = {
        from : "Blink Africa ",
        to: to,
        subject:title,
        html: `<p> ${message} </p>`
    };
    
    
    transporter.sendMail(mailOptions, (err, info)=>{
        if(err){
            return "Error sending email";
            
        }else{
            return "success";
    
        }
    });

}


export default sendEmail