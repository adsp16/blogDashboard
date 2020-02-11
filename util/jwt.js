const jwt = require('jsonwebtoken');
require('dotenv').config();


const verifyUser = (req, res, next) => {

  const token = req.session.token;

  if (!token) {
    return res.render('access-denied');
  }

  try {

    const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = verified;


  } catch (err) {
    console.log(err)
    res.send('Something went wrong');


  }

  next();


}

module.exports = verifyUser;