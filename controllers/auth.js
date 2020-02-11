const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const {
  validateSignUp,
  validationLogin,
  validateNewPassword
} = require('../util/validation');
const crypto = require('crypto');
const {
  sendPasswordReset
} = require('../util/emailer');

const {
  Op
} = require("sequelize");



module.exports.getLogin = (req, res, next) => {

  res.locals.pageTitle = 'Login';
  res.render('login')
}

exports.getSignup = (req, res, next) => {

  res.locals.pageTitle = 'Sign Up';

  res.render('sign-up');
}

exports.postUserSignUp = (req, res, next) => {

  res.locals.pageTitle = 'Sign Up';

  const {
    error
  } = validateSignUp({
    email: req.body.email,
    password: req.body.password,
    repeatpassword: req.body.password
  });

  if (error) {
    const errormessage = error.details[0].message
    res.render('sign-up', {
      error: errormessage,
    })
  } else {

    User.findOne({
        where: {
          email: req.body.email
        }
      })
      .then(user => {
        if (user) {
          req.flash('error_message', 'This user already exists, please try again')
          res.redirect('/signup')
        } else {

          bcrypt.hash(req.body.password, 12, (err, hashedPword) => {
            if (err) throw err;

            if (hashedPword)
              User.create({
                email: req.body.email,
                password: hashedPword
              })

            res.redirect('/login')

          })
        }
      })
      .catch(err => console.log(err))


  }

}


exports.postUserLogin = (req, res, next) => {

  res.locals.pageTitle = 'Login';

  const {
    error
  } = validationLogin({
    email: req.body.email,
    password: req.body.password
  })

  if (error) {

    const errormessage = error.details[0].message;

    res.render('login', {
      email: req.body.email,
      password: req.body.password,
      error: errormessage
    })

  } else {

    User.findOne({
        where: {
          email: req.body.email
        }
      })
      .then(user => {
        if (!user) {
          return res.render('login', {
            email: req.body.email,
            password: req.body.password,
            error: 'No user exists, please sign up'
          })
        } else {
          bcrypt.compare(req.body.password, user.password, (err, isMatch) => {
            if (err) throw err;

            if (!isMatch) {
              res.render('login', {
                email: req.body.email,
                password: req.body.password,
                error: 'Incorrect Password'
              });
            }

            if (isMatch) {

              const token = jwt.sign({
                user_id: user.email
              }, process.env.ACCESS_TOKEN_SECRET)
              req.session.token = token;
              req.session.user = user;
              req.session.isLoggedIn = true;
              req.session.save(() => {
                res.redirect('/dashboard')
              })

            }
          })
        }
      })
      .catch(err => console.log(err));

  }
}

exports.getLogout = (req, res, next) => {

  res.locals.pageTitle = 'Log Out';

  req.session.destroy((err) => {
    console.log(err)
    res.redirect('/');
  });



}

exports.getResetPassword = (req, res, next) => {

  res.locals.pageTitle = 'Reset Password';

  res.render('reset-password', );

}

exports.postResetPassword = (req, res, next) => {

  res.locals.pageTitle = 'Reset Password';

  const emailReset = req.body.email;

  User.findOne({
      where: {
        email: emailReset
      }
    })
    .then(user => {
      if (!user) {
        req.flash('error_message', 'No user exists with this email');
        return req.session(() => {
          res.redirect('/reset-password');
        })
      }

      crypto.randomBytes(32, (err, buffer) => {
        if (err) {
          req.flash('error_message', 'No user exists with this email');
          return req.session(() => {
            res.redirect('/reset-password');
          })
        }

        const token = buffer.toString('hex');

        user.resetToken = token
        user.resetTokenExpiry = Date.now() + 3600000;
        user.save()
          .then(result => {
            sendPasswordReset(user.email, token)
            req.flash('success_message', 'Sent! , Please check your email to reset your password');
            req.session.save(() => {
              return res.redirect('/reset-password');
            })
          })
          .catch(err => console.log(err))

      })
    })
    .catch(err => console.log(err))




}

exports.getNewPassword = (req, res, next) => {

  res.locals.pageTitle = 'New Password';

  const userToken = req.params.token;

  User.findOne({
      where: {
        resetToken: userToken,
        resetTokenExpiry: {
          [Op.gt]: Date.now()
        }
      }
    })
    .then(user => {
      if (!user) {
        req.flash('error_message', 'Password reset link has expired, please request a new one');
        req.session.save(() => {
          return res.redirect('/reset-password');
        })
      } else {

        console.log(user);
        res.render('new-password', {
          userId: user.id,
          message: ''
        })
      }

    }).catch(err => console.log(err))

}

exports.postNewPassword = (req, res, next) => {

  res.locals.pageTitle = 'New Password';

  const newPassword = req.body.newpassword;
  const newRepeatPassword = req.body.newrepeatpassword;
  const userId = req.body.userId;

  const {
    error
  } = validateNewPassword({
    newpassword: newPassword,
    newrepeatpassword: newRepeatPassword
  })

  if (error) {
    const message = error.details[0].message
    return res.render('new-password', {
      userId: userId,
      message: message
    })
  }

  if (newPassword !== newRepeatPassword) {
    const message = 'Passwords do not match'
    return res.render('new-password', {
      userId: userId,
      message: message
    })


  } else {

    bcrypt.hash(newPassword, 12)
      .then(hashedPassword => {
        User.findOne({
            where: {
              id: userId
            }
          })
          .then(user => {
            user.password = hashedPassword
            return user.save()
          })
          .then(savedUser => {
            req.flash('success_message', 'Password has been changed, Please log in')
            req.session.save(() => {
              res.redirect('/login')
            })
          })
          .catch(err => console.log(err))

      })
      .catch(error => console.log(error))

  }
}