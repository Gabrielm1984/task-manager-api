const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'gabrielm_1984@hotmail.com',
        subject: 'Welcome',
        text: `Welcome to task manager app, ${name}.`
    })
}

const sendCancelationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'gabrielm_1984@hotmail.com',
        subject: 'Your account has been Deleted',
        text: `
        Hello ${name}.
        your user: ${email}, has been deleted from task manager app
        Best regards
        `
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
}