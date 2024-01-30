"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const nodemailer = require("nodemailer");
const nodemailer_1 = __importDefault(require("nodemailer"));
const sendEmail = 
// asyncHandler(
(data) => __awaiter(void 0, void 0, void 0, function* () {
    let transporter = nodemailer_1.default.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        // true for 465, false for other ports
        auth: {
            user: process.env.MAIL_ID, // generated ethereal user
            pass: process.env.MAIL_PASSWORD, // generated ethereal password
        },
    });
    // send mail with defined transport object
    let info = yield transporter.sendMail({
        from: '"Hey 👻" <abc@gmail.com.com>', // sender address
        to: data.to, // list of receivers
        subject: data.subject, // Subject line
        text: data.text, // plain text body
        html: data.htm, // html body
    });
    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer_1.default.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
});
// );
exports.default = sendEmail;
