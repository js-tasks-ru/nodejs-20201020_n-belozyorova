const socketIO = require('socket.io');

const Session = require('./models/Session');
const Message = require('./models/Message');

function socket(server) {
  const io = socketIO(server);

  io.use(async function(socket, next) {
    if (socket.handshake.query['token']) {
      const session = await Session.findOne({token: socket.handshake.query['token']}).populate('user');

      if (!session) {
        next(new Error("wrong or expired session token"));
      }

      session.lastVisit = new Date();
      await session.save();

      socket.user = session.user;
      next();
    } else {
      next(new Error('anonymous sessions are not allowed'))
    }
  });

  io.on('connection', function(socket) {
    socket.on('message', async (msg) => {
      await Message.create({
        date: new Date(),
        text: msg,
        chat: socket.user._id,
        user: socket.user.displayName
      });
    });
  });

  return io;
}

module.exports = socket;
