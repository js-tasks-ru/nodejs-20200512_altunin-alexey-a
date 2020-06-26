const socketIO = require('socket.io');

const Session = require('./models/Session');
const Message = require('./models/Message');

function socket(server) {
  const io = socketIO(server);

  io.use(async function(socket, next) {
    const token = socket.handshake.query.token;

    if (token) {
      const session = await Session.findOne({token}).populate('user');
      if (!session) {
        next(new Error('wrong or expired session token'));
      }
    } else {
      next(new Error('anonymous sessions are not allowed'));
    }

    next();
  });

  io.on('connection', async function(socket) {
    const token = socket.handshake.query.token;
    const session = await Session.findOne({token}).populate('user');
    socket.user = session.user;

    socket.on('message', async (msg) => {
      const messageData = {
        user: socket.user.displayName,
        chat: socket.user.id,
        text: msg,
        date: Date.now(),
      };

      const message = new Message(messageData);
      await message.save();
    });
  });

  return io;
}

module.exports = socket;
