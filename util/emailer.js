const sgMail = require('@sendgrid/mail');
require('dotenv').config();


sgMail.setApiKey(process.env.SENDGRID_API_KEY);


const sendPasswordReset = (toEmail, token) => {

  console.log('email sent');
  const msg = {
    to: `${toEmail}`,
    from: 'blogtemplate@blogtemplate.com',
    subject: 'Reset Your Password',
    html: `<h3>Reset Your Password</h3>
            <p>Please use this link to reset the password >> https://blog-templateadsp.herokuapp.com/reset/${token}</p>`,
  }

  return sgMail.send(msg);

}

const sendSignUpEmail = (toEmail) => {

  const msg = {
    to: `${toEmail}`,
    from: 'blogtemplate@blogtemplate.com',
    subject: 'Sign Up To Latest News',
    html: `<h3>Thanks for subscribing you will receive all latest news updates</h3>
            <p>If you have any questions please email blogtemplate@blogtemplate.com</p>`,
  }

  return sgMail.send(msg);

}

module.exports.sendPasswordReset = sendPasswordReset;
module.exports.sendSignUpEmail = sendSignUpEmail;