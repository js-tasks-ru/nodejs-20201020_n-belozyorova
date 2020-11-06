const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'DELETE':
      if (isNestedPath(pathname)) {
        endConnectionOnError(res, 400, 'Bad request');
        return;
      }

      fs.unlink(filepath, (err) => {
          if (err) {
            if (err.code === 'ENOENT') {
              endConnectionOnError(res, 404, 'File not found');
              return;
            }

            endConnectionOnError(res, 500, 'Something went wrong');
            return;
          }

          res.statusCode = 200;
          res.end('File succesfully deleted');
        });

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

function endConnectionOnError(res, statusCode, message, callback) {
  res.statusCode = statusCode;
  res.end(message, 'utf8', callback);
}

function isNestedPath(filename) {
  return filename.indexOf('/') != '-1';
}

module.exports = server;
