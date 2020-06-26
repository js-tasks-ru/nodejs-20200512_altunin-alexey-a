const Message = require('../models/Message');
const mapMessage = require('../mappers/message');

module.exports.messageList = async function messages(ctx, next) {
  if (ctx.user) {
    const messages = await Message.find({user: ctx.user.displayName}).limit(20);;

    ctx.body = {messages: messages.map(mapMessage)};
  } else {
    ctx.throw(401, 'Пользователь не залогинен');
  }
};
