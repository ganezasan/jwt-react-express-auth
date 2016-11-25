// server/app.js
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bodyParser = require('body-parser');
const db = require('./mockDB');

passport.use(new LocalStrategy({
    usernameField: 'email',
  },
  function(email, password, cb) {
    db.users.findByEmail(email, function(err, user) {
      if (err) { return cb(err); }
      if (!user) { return cb(null, false); }
      if (user.password != password) { return cb(null, false); }
      return cb(null, user);
    });
  }
));

// Configure Passport authenticated session persistence.
passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  db.users.findById(id, function (err, user) {
    if (err) { return cb(err); }
    cb(null, user);
  });
});

const app = express();

app.use(bodyParser.json());

// session
app.use(session({
  secret: 'passport-example-app',
  saveUninitialized: true,
  resave: true,
}));

//use passport
app.use(passport.initialize());
app.use(passport.session());

function isAuthenticated(req, res, next){
  if (req.isAuthenticated()) {  // 認証済
    return next();
  }
  else {  // 認証されていない
    res.redirect('/sign-in');  // ログイン画面に遷移
  }
}

// setup logger
app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] :response-time ms'));

//
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// serve static assets
app.use('/static', express.static(path.join(__dirname, '..', 'public-client', 'build/static')));
app.use('/private/static', express.static(path.join(__dirname, '..', 'private-client', 'build/static')));

// always return the main index.html, so react-router render the route in the client
app.get('/private*',
  isAuthenticated,
  (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'private-client', 'build', 'index.html'));
  });

app.get('/sign-in',
  (req, res, next) => {
    if (req.isAuthenticated()) {
      res.redirect("/private");
    }else {
      next();
    }
  });

app.get('/sample',
  isAuthenticated,
  function(req, res, next){
    next();
  });

app.post('/sign-in', function(req, res, next) {
  passport.authenticate('local', function(err, user) {
    if (err) {
      return next(err); // will generate a 500 error
    }
    if (! user) {
      return res.send({ success : false, message : 'authentication failed' });
    }

    req.login(user, loginErr => {
      if (loginErr) {
        return next(loginErr);
      }
      return res.send({ success : true, message : 'authentication succeeded', redirect: '/private' });
    });
  })(req, res, next);
});

app.post('/logout', function(req, res) {
  req.logout();
  return res.send({ success : true, message : 'logout succeeded', redirect: '/sign-in' });
});

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'public-client', 'build', 'index.html'));
});


module.exports = app;
