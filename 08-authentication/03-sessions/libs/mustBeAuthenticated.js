module.exports = function mustBeAuthenticated(ctx, next) {
  if (ctx.user === undefined) {
    ctx.status = 401;
    ctx.body = {error: 'Пользователь не залогинен'};
    return;
  }

  return next();
};
