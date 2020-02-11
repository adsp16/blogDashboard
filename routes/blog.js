const express = require('express');

const router = express.Router();

const blogController = require('../controllers/blog');

router.get('/', blogController.getIndex);

router.get('/blogpost/:id', blogController.getBlogPost);

router.post('/', blogController.postSignupEmail);


module.exports = router;