// IMPORTANT! This test is using a Test Application register and will need to be changed for live once a Domain is set.
//Once a token is received on req.user.token, use https://us.api.battle.net/wow/user/characters?access_token= to get character information.

require('dotenv').config();
const https = require('https');
const fs = require('fs');
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const strategy = require(`${__dirname}/strategy.js`);
const { SECRET } = process.env;

const httpsOptions = {
  key: fs.readFileSync('./security/cert.key'),
  cert: fs.readFileSync('./security/cert.pem')
};

const app = express();

app.use(session({
    secret: SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use( passport.initialize() );
app.use( passport.session() );
passport.use( strategy );

passport.serializeUser( function(user, done) {
    done(null, user);
});

passport.deserializeUser( function(obj, done) {
    done(null, obj);
});

app.get('/login', passport.authenticate('bnet'));

app.get('/auth/bnet/callback',
        passport.authenticate('bnet', { failureRedirect: '/' }),
        function(req, res){
          res.redirect('/');
        });

app.get('/', function(req, res) {
  if(req.isAuthenticated()) {
    var output = '<h1>Express OAuth Test</h1>' + req.user.id + '<br>';
    console.log(req.user);
    if(req.user.battletag) {
      output += req.user.battletag + '<br>';
    }
    output += '<a href="/logout">Logout</a>';
    res.send(output);
  } else {
    res.send('<h1>Express OAuth Test</h1>' +
        '<a href="/login">Login with Bnet</a>');
  }
});

app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

const port = 3000;
const server = https.createServer( httpsOptions, app );

server.listen( port, () => {
  console.log( 'Express server listening on port ' + server.address().port );
} );