const Post = require('../models/post');
const {
  sendSignUpEmail
} = require('../util/emailer');
const {
  validateCreatePost
} = require('../util/validation')




exports.getBlogPost = (req, res, next) => {


  let relatedPostsArr;

  Post.findAll({
      where: {
        featuredpost: 'yes'
      },
      limit: 3
    }).then(relatedPost => {
      relatedPostsArr = relatedPost;



      return Post.findByPk(req.params.id)
    })
    .then(post => {

      res.locals.pageTitle = `${post.title}`;

      res.render('singlepost', {
        title: post.title,
        author: post.author,
        postbody: post.postbody,
        relatedPosts: relatedPostsArr,
        image: post.image,
      });
    })
    .catch(err => console.log(err))







}


exports.getIndex = (req, res, next) => {

  res.locals.pageTitle = 'Home'

  let homeposts;

  Post.findAll({
      where: {
        homepagepost: 'yes'
      }
    }).then(result => {

      homeposts = result;

      return Post.findAll({
        where: {
          featuredpost: 'yes'
        }
      })

    })
    .then(featuredPosts => {

      res.render('index', {
        posts: homeposts,
        featuredPosts: featuredPosts
      })

    })
    .catch(err => console.log(err))

}

exports.postSignupEmail = (req, res, next) => {

  const email = req.body.email;

  sendSignUpEmail(email);

  req.flash('success_message', `${email} is now signed up to our mailing list`);
  req.session.save(() => {
    res.redirect('/');
  });



}