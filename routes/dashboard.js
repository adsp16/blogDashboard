const express = require('express');
const upload = require('../util/multer');
const verifyUser = require('../util/jwt');

const router = express.Router();

const dashboardController = require('../controllers/dashboard');

router.get('/dashboard', verifyUser, dashboardController.getDashboard);

router.get('/dashboard-posts', verifyUser, dashboardController.getDashboardPostsPage);

router.get('/dashboard-editpost/:id', verifyUser, dashboardController.getEditPost);

router.get('/dashboard-your-posts', verifyUser, dashboardController.getYourPosts);

router.get('/dashboard-usersettings', verifyUser, dashboardController.getUserSettings);

router.post('/dashboard-posts', verifyUser, upload.single('post-image-upload'), dashboardController.addPost);

router.post('/dashboard-editpost', verifyUser, upload.single('post-image-upload'), dashboardController.postEditPost);

router.post('/dashboard-usersettings', verifyUser, upload.single('post-image-upload'), dashboardController.postUserSettings);

router.get('/delete-post/:id', verifyUser, dashboardController.deletePost);


module.exports = router;