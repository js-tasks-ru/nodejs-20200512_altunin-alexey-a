const url = require('url');
const http = require('http');
const path = require('path');
const fse = require('fs-extra');
const LimitSizeStream = require('./LimitSizeStream');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'POST':
      if (req.url.split('/').length > 2) {
        res.statusCode = 400;
        res.end('nested directories are not supported');

        break;
      }

      if (fse.existsSync(filepath)) {
        res.statusCode = 409;
        res.end('file exists');

        break;
      }

      const limitStream = new LimitSizeStream({limit: 1000000});
      const writeStream = fse.createWriteStream(filepath);

      req.pipe(limitStream).pipe(writeStream);

      limitStream.on('error', function(err) {
        if (err.code === 'LIMIT_EXCEEDED') {
          res.statusCode = 413;
          res.end('1mb limit is exceeded');
        } else {
          res.statusCode = 500;
          res.end('Internal server error');
        }

        fse.unlink(filepath);
      });

      writeStream.on('close', function() {
        res.statusCode = 201;

        res.end('file was written');
      });

      req.on('close', function() {
        if (res.finished) return;
        fse.unlink(filepath);
      });

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
