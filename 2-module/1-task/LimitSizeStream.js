const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);

    this.limit = options.limit;
  }

  _transform(chunk, encoding, callback) {
    if (chunk.length < this.limit) {
      this.push(chunk);
      callback();
    } else {
      callback(new LimitExceededError(), chunk);
    }
  }
}

module.exports = LimitSizeStream;
