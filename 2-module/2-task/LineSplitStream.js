const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);

    this.bufferString = '';
  }

  _transform(chunk, encoding, callback) {
    this.bufferString += chunk;
    callback();
  }

  _flush(callback) {
    for (const chunkPart of this.bufferString.split(os.EOL)) {
      this.push(chunkPart);
    }

    callback();
  }
}

module.exports = LineSplitStream;
