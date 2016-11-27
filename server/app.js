// server/app.js
const morgan = require('morgan');
const path = require('path');

const express = require('express');
const boom = require('express-boom');
const bodyParser = require('body-parser');

//passport
const passport = require('passport');
const passportJWT = require("passport-jwt");
const jwt = require('jsonwebtoken');

const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;
const LocalStrategy = require('passport-local').Strategy;

const db = require('./mockDB');

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeader(),
  secretOrKey: 'jwt-react-express-auth',
  expiresIn: { expiresIn: 60}, //1 minitus
};

passport.use(new JwtStrategy(jwtOptions,
  function(jwt_payload, cb) {
    // usually this would be a database call:
    db.users.findById(jwt_payload.id, function(err, user) {
      if (err) { return cb(err); }
      if (!user) { return cb(null, false); }
      return cb(null, user);
    });
  }
));

passport.use(new LocalStrategy({
    usernameField: 'email',
    session: false,
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

//use passport
app.use(passport.initialize());

//use boom
app.use(boom());

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
  (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'private-client', 'build', 'index.html'));
  });

app.post('/api/sign-in', function(req, res, next) {
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
      const payload = {id: user.id};
      const token = jwt.sign(payload, jwtOptions.secretOrKey, jwtOptions.expiresIn);
      return res.send({ success : true, message : 'authentication succeeded', redirect: '/private', token: token});
    });
  })(req, res, next);
});

app.get('/api/sign-in',
  (req, res) => {
    const jsonWebToken = req.headers.authorization.split(' ')[1];

    jwt.verify(jsonWebToken, jwtOptions.secretOrKey, (err, decode) => {
      if (err) {
        return res.boom.badImplementation(String(err));
      }

      db.users.findById(decode.id, function(err, user) {
        if (err) { return res.boom.unauthorized(String(err)); }
        if (!user) { return res.boom.unauthorized('user not found'); }
        return res.send(user);
      });
    });
  }
);

app.post('/api/logout', function(req, res) {
  req.logout();
  return res.send({ success : true, message : 'logout succeeded', redirect: '/sign-in' });
});

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'public-client', 'build', 'index.html'));
});


module.exports = app;
