import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    // Configuration uses your secure Railway environment variables
    host: process.env.MAIL_HOST,
    port: 587, // Standard port for secured SMTP
    secure: false, // Use TLS
    auth: {
        user: process.env.MAIL_USER, // Your service username (often 'apikey')
        pass: process.env.MAIL_PASS  // Your service password/API key
    }
});