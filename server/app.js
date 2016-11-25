// server/app.js
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const DynamoDBStore = require('connect-dynamodb')({session: session});
const LocalStrategy = require('passport-local').Strategy;
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');


var db={
  users:{
    records:[{
      id:"1",
      username:"user",
      password:"password",
      name:"Hibohiboo"
    }],
    findById(id, cb) {
      process.nextTick(() => {
        var idx = id - 1;
        var record=this.records[idx];
        if (record) {
          cb(null, record);
        } else {
          cb(new Error('User ' + id + ' does not exist'));
        }
      });
    },
    findByUsername(username, cb){
      process.nextTick(()=> {
        for (var i = 0, len = this.records.length; i < len; i++) {
          var record = this.records[i];
          if (record.username === username) {
            return cb(null, record);
          }
        }
        return cb(null, null);
      });
    }
  }
};


passport.use(new LocalStrategy(
  function(username, password, cb) {
    db.users.findByUsername(username, function(err, user) {
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

const dynamoDBoptions = {
  table: 'startupdb-sessions',
  AWSConfigPath: './credentials.json',
  AWSConfigJSON: {
    region: 'ap-northeast-1',
    correctClockSkew: true
  },
  // Defaults to 600000 (10 minutes).
  reapInterval: 600000
};

app.use(cookieParser());
app.use(bodyParser.json());

// session
app.use(session({
  store: new DynamoDBStore(dynamoDBoptions),
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

app.post('/sign-in',
  passport.authenticate('local', {
    failureRedirect: '/sign-in'
  }),
  function(req, res) {
    res.redirect('/private');
  });

app.get('*', (req, res, next) => {
  res.sendFile(path.resolve(__dirname, '..', 'public-client', 'build', 'index.html'));
});


module.exports = app;
