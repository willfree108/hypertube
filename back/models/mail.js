const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'hyper424242@gmail.com',
        pass: 'hyper242424'
    }
});

/**
 *  Mail to activate an account
 */

const activate = function ({ username, firstName, lastName, email, verifyToken }, host = 'localhost:3000/#/activation/') {
  return new Promise(function(resolve, reject) {
    const message = {
      from: 'A Random Hypertube <sender@example.com>',
      to:  `"${firstName} ${lastName}" <${email}>`,
      subject: `A Random Hypertube Welcome You ${username} ✔`,
      text: `"${firstName} ${lastName}"`,
      html:`<p>Weltome to a random Hypertube! Please activate your account by clicking on the following link: <a href='http://${host}${verifyToken}'>This Link!</a><br/></p>`
    }

    transporter.sendMail(message, error => {
      console.log(`Message activation for ${username} sent successfully!`)
      if (error) reject()
      else resolve()
    })
  })
}

/**
 *  Mail to recover an account
 */

const recover = function ({ username, firstName, lastName, recoverToken, email }, host = 'localhost:3000/#/init/') {
  return new Promise(function(resolve, reject) {
    const message = {
      from: 'A Random Hypertube <sender@example.com>',
      to:  `"${firstName} ${lastName}" <${email}>`,
      subject: `A Random Hypertube Password Recovery ${username}✔`,
      text: `"${firstName} ${lastName}"`,
      html:`<p>Seem like you forget your password. Click on the following link to recover it! <a href='http://${host}${recoverToken}'>This Link!</a><br/></p>`
    }

    transporter.sendMail(message, error => {
      console.log(`Message recover for ${username} sent successfully!`)
      if (error) reject()
      else resolve()
    })
  })
}

module.exports = {
  activate,
  recover
}
