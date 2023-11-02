import nodemailer from 'nodemailer'
import 'dotenv/config'
import pug from 'pug'
import path from 'path'

type Email = {
    name: string
    content: string
    link: string
    buttonText: string,
    header: string
}

async function renderPug(data: Email, to: string, title: string) {
    // Compile the source code
    const html = pug.renderFile(
        path.join(__dirname, '..', '..', 'templates', 'AccountCreation.pug'), data)
        await sendMail(html, to, title, data.content)
}
// async..await is not allowed in global scope, must use a wrapper
async function sendMail(html: string, email: string, subject: string, text: string) {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing

    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
        service: 'webmail',
        host: process.env.MAIL_HOST,
        port: 465,
        auth: {
            user: process.env.MAIL_USER, // generated ethereal user
            pass: process.env.MAIL_PASS, // generated ethereal password
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"Support Team 🚀" <trevis.wamuthenya@mwook.com>', // sender address
        to: email, // list of receivers
        subject: subject, // Subject line
        text, // plain text body
        html // html body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

export {
    renderPug
}