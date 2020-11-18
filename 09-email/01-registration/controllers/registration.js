const { v4: uuid } = require('uuid');
const User = require('../models/User');
const sendMail = require('../libs/sendMail');

module.exports.register = async (ctx, next) => {
  if (!ctx.request.body.email) {
    ctx.status = 400;
    ctx.body = {errors: {email: 'Некорректный email'}};
    return;
  }

  try {
    let user = await User.findOne({email: ctx.request.body.email});

    if (user) {
      ctx.status = 400;
      ctx.body = {errors: {email: 'Такой email уже существует'}};
      return next();
    }

    const token = uuid();

    user = await User.create({
      verificationToken: token,
      email: ctx.request.body.email,
      displayName: ctx.request.body.displayName
    });

    await user.setPassword(ctx.request.body.password);
    await user.save();

    await sendMail({
      template: 'confirmation',
      to: user.email,
      subject: 'Подтвердите почту',
      locals: {token: token}
    });

    ctx.status = 200;
    ctx.body = {status: 'ok'};
  } catch(err) {
    ctx.throw(err);
  }
};

module.exports.confirm = async (ctx, next) => {
  try {
    const user =  await User.findOne({verificationToken: ctx.request.body.verificationToken});

    if (!user) {
      ctx.status = 400;
      ctx.body = {error: 'Ссылка подтверждения недействительна или устарела'};
      return;
    }

    await user.verify();
    await user.save();

    ctx.status = 200;
    ctx.body = {token: uuid()};
  } catch(err) {
    ctx.throw(err);
  }
};
