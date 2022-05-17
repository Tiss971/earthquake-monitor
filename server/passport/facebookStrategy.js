var FacebookStrategy = require('passport-facebook');
const User = require("../database/models/user")

const strategy = new FacebookStrategy({
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: "/auth/facebook/callback",
    profileFields: ['id', 'email','displayName', 'photos'],
  },
  async (accessToken, refreshToken, profile, done) => {
    const username = profile.displayName || `${profile.name.givenName} ${profile.name.familyName}`;
    const email = profile.email || null;
    const image = profile.photos[0].value;
    const third_party_auth = {
        provider_name: profile.provider,
        provider_id: profile.id,
        provider_data: {
            accessToken,
            refreshToken,
        },
    };
    const userExist = await User.findOneAndUpdate({third_party_auth: {$elemMatch: {provider_id:profile.id}}},{lastVisit: Date.now()}).exec();;
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
    console.log("User found", userExist.third_party_auth[0].provider_name);
    if (userExist.third_party_auth[0].provider_name != "facebook") {
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