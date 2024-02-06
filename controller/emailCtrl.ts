// // const nodemailer = require("nodemailer");
// import nodemailer from "nodemailer";
// // const asyncHandler = require("express-async-handler");
// import asyncHandler from "express-async-handler";
// import { Request } from "express";
// import { transporter } from "../utils/emaiTransporter";

// const sendEmail =
//   // asyncHandler(
//   async (data: { to: string; text: string; subject: string; htm: string }) => {
//     // let transporter = nodemailer.createTransport({
//     //   host: "sandbox.smtp.mailtrap.io",
//     //   port: 2525,
//     //   // true for 465, false for other ports
//     //   auth: {
//     //     user: process.env.MAIL_ID, // generated ethereal user
//     //     pass: process.env.MAIL_PASSWORD, // generated ethereal password
//     //   },
//     // });

//     // send mail with defined transport object
//     let info = await transporter.sendMail({
//       from: '"Hey 👻" <abc@gmail.com.com>', // sender address
//       to: data.to, // list of receivers
//       subject: data.subject, // Subject line
//       text: data.text, // plain text body
//       html: data.htm, // html body
//     });

//     console.log("Message sent: %s", info.messageId);
//     // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

//     // Preview only available when sending through an Ethereal account
//     console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
//     // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
//   };
// // );

// export default sendEmail;
