"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderPug = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
require("dotenv/config");
const pug_1 = __importDefault(require("pug"));
const path_1 = __importDefault(require("path"));
async function renderPug(data, to, title) {
    // Compile the source code
    const html = pug_1.default.renderFile(path_1.default.join(__dirname, '..', '..', 'templates', 'AccountCreation.pug'), data);
    await sendMail(html, to, title, data.content);
}
exports.renderPug = renderPug;
// async..await is not allowed in global scope, must use a wrapper
async function sendMail(html, email, subject, text) {
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
        from: '"Support Team 🚀" <trevis.wamuthenya@mwook.com>',
        to: email,
        subject: subject,
        text,
        html // html body
    });
    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer_1.default.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}
