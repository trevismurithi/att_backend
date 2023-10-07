"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
require("dotenv/config");
// async..await is not allowed in global scope, must use a wrapper
async function sendMail(html, email) {
    console.log('email: ', email);
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer_1.default.createTransport({
        service: 'webmail',
        host: process.env.MAIL_HOST,
        port: 465,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS, // generated ethereal password
        },
        tls: {
            rejectUnauthorized: false
        }
    });
    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"Support Team 👻" trevis@360onlineafrica.co.ke',
        to: email,
        subject: "Hello ✔",
        text: "Hello world?",
        html // html body
    });
    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer_1.default.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}
exports.sendMail = sendMail;
