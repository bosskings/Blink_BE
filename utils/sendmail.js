import nodemailer from "nodemailer";

const sendEmail =(to, message, title) =>{

    const transporter = nodemailer.createTransport({
        // Configuration uses your secure Railway environment variables
        host: process.env.MAIL_HOST,
        port: 587, // Standard port for secured SMTP
        secure: false, // Use TLS
        auth: {
            user: "FoodGrabafrica@gmail.com",
            pass: process.env.MAIL_PASS  // Your service password/API key
        }
    });
    
    const mailOptions = {
        from : "FoodGrab Africa <foodgrabafrica@gmail.com>",
        to: to,
        subject: title,
        html: `<p> ${message} </p>`
    };
    
    
    transporter.sendMail(mailOptions, (err, info)=>{
        if(err){
            console.log("Error sending email", err);
            
        }else{
            console.log('success',info.messageId );
    
        }
    });

}


export default sendEmail