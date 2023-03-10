import nodemailer from 'nodemailer'

// async..await is not allowed in global scope, must use a wrapper
async function sendMail(html: string) {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        service: 'webmail',
        host: 'mail.jcceastlands.com',
        port: 26,
        auth: {
            user: 'user@jcceastlands.com', // generated ethereal user
            pass: '#1234Trevis5678', // generated ethereal password
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"Support Team 👻" <no-reply@jcceastlands-no-reply.com>', // sender address
        to: "trevismurithi@gmail.com", // list of receivers
        subject: "Hello ✔", // Subject line
        text: "Hello world?", // plain text body
        html // html body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

export {
    sendMail
}