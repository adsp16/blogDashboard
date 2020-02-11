const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const verifyUser = require('../util/jwt');


router.get('/signup', authController.getSignup);

router.get('/login', authController.getLogin);

router.get('/logout', authController.getLogout);

router.post('/login', authController.postUserLogin);

router.post('/signup', authController.postUserSignUp);

router.get('/reset-password', authController.getResetPassword);

router.post('/reset-password', authController.postResetPassword);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);




module.exports = router;