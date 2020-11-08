const path = require('path');
const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

app.use(async (ctx, next) => {
    try {
      await next();
    } catch(err) {
      console.log(err);
      if (err.status) {
        ctx.status = err.status;
        ctx.body = err.message;
        return;
      }

      console.log(err);
      ctx.status = 500;
      ctx.body = 'Some error occured';
    }
});

const createPromise = () => {
  let resolver

  return [
      new Promise((resolve, reject) => {
          resolver = resolve;
      }),
      resolver,
  ];
}

let [newMessage, setNewMessage] = createPromise();

router.get('/subscribe', async (ctx, next) => {
  ctx.body = await newMessage;
  ctx.status = 200;
});

async function validateMessage(ctx, next) {
  if (typeof ctx.request.body.message === 'undefined' || ctx.request.body.message === '') {
    ctx.throw(400, 'Empty message');
  }
  return next();
}

router.post('/publish', validateMessage, async (ctx, next) => {
  setNewMessage(ctx.request.body.message);
  [newMessage, setNewMessage] = createPromise();
  ctx.status = 200;
  ctx.body = 'ok';
});

app.use(router.routes());

module.exports = app;
