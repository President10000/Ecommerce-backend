import nodemailer from "nodemailer";
import dotenv from "dotenv"
dotenv.config();

export const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    auth: {
      user: process.env.MAIL_USER, 
      pass: process.env.MAIL_PASSWORD, 
    },
  });