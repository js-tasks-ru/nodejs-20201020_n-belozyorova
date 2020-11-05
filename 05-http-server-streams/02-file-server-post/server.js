const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const LimitSizeStream = require('./LimitSizeStream');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'POST':
      if (isNestedPath(pathname)) {
        endConnectionOnError(res, 400, 'Bad request');
        return;
      }

      const limitStream = new LimitSizeStream({limit: 1024*1024});

      req
        .pipe(limitStream)
        .on('error', err => {
          if (err.code === 'LIMIT_EXCEEDED') {
            endConnectionOnError(res, 413, 'File size exceed 1 Mb', () => {
              fs.unlink(filepath, (err) => {
                if (err) throw err;
              });
            });
            return;
          }

          endConnectionOnError(res, 500, 'Something went wrong');
        })
        .pipe(fs.createWriteStream(filepath, {'flags': 'wx', 'emitClose': true})
                .on('error', err => {
                  if (err.code === 'EEXIST') {
                    endConnectionOnError(res, 409, 'File with specified name already exists');
                    return;
                  }

                  endConnectionOnError(res, 500, 'Something went wrong');
                })
        )
        .on('close', () => {
          res.statusCode = 201;
          res.end('File succesfully created');
        });


        req.on('close', () => {
          if (req.aborted) {
            fs.unlink(filepath, (err) => {
              if (err) throw err;
            });
          }
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
