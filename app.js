const express = require('express');
const aws = require('aws-sdk');
const bodyParser = require('body-parser');
require('dotenv').config();
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');
// const helmet = require('helmet');


// const compression = require('compression');
const SessionStore = require('express-session-sequelize')(session.Store);



const app = express();


app.use(express.static(path.join(__dirname, '/dist')));
app.use(express.static(path.join(__dirname, '/uploads')));
app.use('/blogpost', express.static(path.join(__dirname, '/uploads')));
app.use('/dashboard-editpost', express.static(path.join(__dirname, '/uploads')));



aws.config.update({
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  region: "eu-west-2"
});


// DB connection pool
const sequelize = require('./util/database');


//Connect to DB via Sequelize
sequelize.sync()
  .then(() => console.log('Database Connected'))
  .catch(err => console.log(err));

//EJS
app.set('view engine', 'ejs');

const authRoutes = require('./routes/auth');
const blogRoutes = require('./routes/blog');
const dashboardRoutes = require('./routes/dashboard');

// app.use(helmet());
// app.use(compression());

//Express body parser
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

// Express sequelize session store 
const sequelizeSessionStore = new SessionStore({
  db: sequelize,
})

// Express Session
app.use(session({
  secret: 'keyboard cat',
  store: sequelizeSessionStore,
  resave: false,
  saveUninitialized: false,
}))


//Connect flash
app.use(flash());

// Global variables
app.use((req, res, next) => {
  res.locals.success_message = req.flash('success_message');
  res.locals.error_message = req.flash('error_message');
  res.locals.error = req.flash('error');
  res.locals.isLoggedIn = req.session.isLoggedIn;
  res.locals.postTitle = req.session.postTitle;
  res.locals.author = req.session.author;
  res.locals.postBody = req.session.postBody;
  res.locals.userimage = req.session.image;
  next();
});

//Routes
app.use(authRoutes);
app.use(blogRoutes);
app.use(dashboardRoutes);

//404 
app.use((req, res, next) => {
  res.status(404).render('404');
  next();
})

//Sync Database with MySQL if ok start Server


app.listen(process.env.PORT || 3000, function () {
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});