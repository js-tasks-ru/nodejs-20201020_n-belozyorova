const User = require('../../models/User');

module.exports = async function authenticate(strategy, email, displayName, done) {
  try {
    if (typeof email === 'undefined' || email === '') {
      done(null, false, 'Не указан email');
      return;
    }

    let user = await User.findOne({email: email});

    if (!user) {
      user = await User.create({
        email: email,
        displayName: displayName
      });
    }

    done(null, user);
  } catch(err) {
    done(err);
  }
};
