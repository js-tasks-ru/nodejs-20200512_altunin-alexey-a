const socketIO = require('socket.io');

const Session = require('./models/Session');
const Message = require('./models/Message');

function socket(server) {
  const io = socketIO(server);

  io.use(async function(socket, next) {
    next();
  });

  io.on('connection', async function(socket) {
    const token = socket.handshake.query.token;

    if (token) {
      const session = await Session.findOne({token}).populate('user');
      if (!session) {
        ctx.throw(401, 'wrong or expired session token');
      }

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
    } else {
      io.emit('error', "anonymous sessions are not allowed");
    }
  });

  return io;
}

module.exports = socket;
