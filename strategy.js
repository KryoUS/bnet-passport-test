const BnetStrategy = require('passport-bnet');
const { CLIENT_ID, CLIENT_SECRET } = process.env;

module.exports = new BnetStrategy({
    clientID: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    scope: "wow.profile sc2.profile",
    callbackURL: "https://localhost:3000/auth/bnet/callback"
},
function(accessToken, refreshToken, extraParams, profile, done) {
    // accessToken is the token to call Auth0 API (not needed in the most cases)
    // extraParams.id_token has the JSON Web Token
    // profile has all the information from the user
    return done(null, profile);
});