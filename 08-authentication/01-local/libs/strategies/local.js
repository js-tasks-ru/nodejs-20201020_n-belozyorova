const LocalStrategy = require('passport-local').Strategy;
const User = require('../../models/User');

module.exports = new LocalStrategy(
    {usernameField: 'email', session: false},
    function(email, password, done) {
      User.findOne({email: email }, async function (err, user) {
          if (err) return done(err);

          if (!user) {
            done(null, false, 'Нет такого пользователя');
            return;
          }

          passwordMatch = await user.checkPassword(password);

          if (!passwordMatch) {
            done(null, false, 'Неверный пароль');
            return;
          }

          done(null, user);
      });
    }
);
