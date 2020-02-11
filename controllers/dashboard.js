const User = require('../models/user');
const Post = require('../models/post');
const {
  validateCreatePost,
  validateUserSettings,
} = require('../util/validation')
const bcrypt = require('bcrypt');
const {
  Op
} = require("sequelize");



exports.addPost = (req, res, next) => {

  res.locals.pageTitle = 'Add Post';

  const postTitle = req.body.post_title;
  const author = req.body.author;
  const postBody = req.body.postBody;
  const userEmail = req.session.user.email;
  const optionSelect = req.body.subject;

  req.session.postTitle = postTitle;
  req.session.author = author;
  req.session.postBody = postBody;

  const {
    error
  } = validateCreatePost({
    title: req.body.post_title,
    author: req.body.author,
    postbody: req.body.postBody,
  })


  if (error) {

    console.log(error);
    req.flash('error_message', error.message)
    req.session.save(() => {
      res.redirect('/dashboard-posts')
    })

  }

  if (!optionSelect) {
    req.flash('error_message', 'Please select a post subject')
    req.session.save(() => {
      res.redirect('/dashboard-posts')
    })
  }

  if (!req.file) {
    req.flash('error_message', 'Please upload a file')
    req.session.save(() => {
      res.redirect('/dashboard-posts')
    })

  }

  if (req.file.mimetype.startsWith('image') != true) {

    req.flash('error_message', 'Please upload .jpg or .png')
    req.session.save(() => {
      res.redirect('/dashboard-posts')
    })

  } else {

    console.log(req.file);

    Post.create({
        user: userEmail,
        title: postTitle,
        image: req.file.location,
        author: author,
        postbody: postBody,
        category: optionSelect
      })
      .then(result => {
        req.flash('success_message', 'Post has been created');
        // req.session.postTitle = '';
        // req.session.author = '';
        // req.session.postBody = '';
        req.session.save(() => {
          res.redirect('/dashboard-posts')
        })
      })
      .catch(err => console.log(err));


  }

}

exports.getDashboardPostsPage = (req, res, next) => {

  res.locals.pageTitle = 'Dashboard';

  res.render('dashboard-posts', {
    email: req.session.user.email,
    image: req.session.user.image
  })
}

exports.getDashboard = (req, res, next) => {

  res.locals.pageTitle = 'Dashboard';

  res.render('dashboard', {
    email: req.session.user.email,
    image: req.session.user.image
  });
}

exports.getEditPost = (req, res, next) => {

  res.locals.pageTitle = 'Dashboard';

  Post.findByPk(req.params.id)
    .then(post => {
      if (!post) {
        res.redirect('/dashboard');
      } else {
        res.render('dashboard-editpost', {
          email: req.session.user.email,
          postid: post.id,
          title: post.title,
          author: post.author,
          subject: post.category,
          postbody: post.postbody,
          featuredpost: post.featuredpost,
          homepagepost: post.homepagepost,
          image: req.session.user.image,
        });
      }
    })
    .catch((error) => {
      console.log(error);
    })


}

exports.getYourPosts = (req, res, next) => {

  res.locals.pageTitle = 'Dashboard';

  const email = req.session.user.email;

  Post.findAll({
    where: {
      user: email
    }
  }).then(posts => {
    res.render('dashboard-your-posts', {
      email: req.session.user.email,
      posts: posts,
      postId: posts.id,
      image: req.session.user.image
    });
  }).catch(err => {
    console.log(err);
  })

}

exports.postEditPost = (req, res, next) => {

  res.locals.pageTitle = 'Dashboard';

  const postId = req.body.postid;
  const title = req.body.post_title;
  const author = req.body.author;
  const postBody = req.body.postBody;
  const subject = req.body.subject;
  const homepage = req.body.homepage;
  const featuredPost = req.body.featuredPost;



  Post.findOne({
      where: {
        id: postId
      }
    })
    .then(post => {

      if (req.file) {
        post.image = req.file.filename;
      }

      post.title = title;
      post.author = author;
      post.postbody = postBody;
      post.featuredpost = featuredPost;
      post.homepagepost = homepage;
      post.category = subject;


      return post.save();

    })
    .then(savedPost => {
      req.flash('success_message', 'Post saved')
      req.session.save(() => {
        res.redirect(`/dashboard-editpost/${postId}`)
      })
    })
    .catch(err => console.log(err))


}


exports.postUserSettings = (req, res, next) => {

  res.locals.pageTitle = 'Dashboard';

  const firstname = req.body.firstname;
  const secondname = req.body.surname;
  const newPassword = req.body.password;
  const file = req.file;
  console.log(req.file);

  User.findOne({
      where: {
        email: req.session.user.email
      }
    })
    .then(user => {
      if (!user) {
        req.flash('error_message', 'Could not find user')
        req.session.save(() => {
          return res.redirect(`/dashboard-usersettings`)
        })
      }

      if (firstname) {
        user.firstname = firstname;
      }

      if (secondname) {
        user.surname = secondname;
      }

      if (newPassword) {
        bcrypt.hash(newPassword, 12)
          .then(hashedPassword => {
            user.password = hashedPassword
          })
          .catch(error => console.log(error));
      }

      if (file) {
        user.image = req.file.location;
        req.session.user.image = req.file.location
      }

      user.save()
        .then(savedUser => {
          req.flash('success_message', 'User details have been updated');
          req.session.save(() => {
            return res.render('dashboard-usersettings', {
              email: user.email,
              image: req.session.user.image,
              firstname: req.body.firstname,
              secondname: req.body.surname,
              signupdate: user.SignUpDate
            })
          })
        })
        .catch(err => console.log(err))

    })
    .catch(err => console.log(err))
}

exports.getUserSettings = (req, res, next) => {

  res.locals.pageTitle = 'Dashboard';

  const dateObj = new Date(req.session.user.SignUpDate);
  const formatedDate = dateObj.toDateString();
  const formatedTime = dateObj.toLocaleTimeString();

  User.findOne({
      where: {
        email: req.session.user.email
      }
    })
    .then(user => {
      res.render('dashboard-usersettings', {
        email: user.email,
        firstname: user.firstname,
        secondname: user.surname,
        image: user.image,
        signupdate: `${formatedDate} ${formatedTime}`,
      })
    })
    .catch(err => console.log(err));

}

exports.deletePost = (req, res, next) => {

  const postId = req.params.id;

  Post.destroy({
      where: {
        id: postId
      }
    })
    .then((deleted) => {
      console.log(deleted);
      req.flash('success_message', 'Post has been deleted')
      req.session.save(() => {
        res.redirect('/dashboard')

      })
    })
    .catch(err => console.log(err))

}