var GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require("../database/models/user")

const strategy = new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback",
  },
  async (accessToken, refreshToken, profileObj, done) => {
    const username = profileObj.displayName || `${profileObj.name.givenName} ${profileObj.name.familyName}`;
    const email = profileObj.emails[0].value;
    const image = profileObj.photos[0].value;
    const third_party_auth = {
        provider_name: profileObj.provider,
        provider_id: profileObj.id,
        provider_data: {
            accessToken,
            refreshToken,
        },
    };

    const userExist = await User.findOneAndUpdate({ email: email },{lastVisit: Date.now()}).exec();;
    if (!userExist) {
        console.log("User not found, creating new user");
        const newUser = await User.create({
            username,
            email,
            image,
            third_party_auth,
            lastVisit: Date.now()
        });
        return done(null, newUser);
    }
    console.log("User found");
    if (userExist.third_party_auth[0].provider_name != "google") {
        console.log("Not the same provider");
        //return error
        return done(null, false, 'You have previously signed up with a different signin method');
    }
    console.log("Updating user");
    userExist.lastVisit = Date.now();
    return done(null, userExist);
  }
)

module.exports = strategy