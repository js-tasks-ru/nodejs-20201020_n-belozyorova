const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);

    this.lines = [];
    this.linePart = '';
  }

  _transform(chunk, encoding, callback) {
    this.lines = chunk.toString().split(`${os.EOL}`);
    this.lines[0] = this.linePart + this.lines[0];
    this.linePart = this.lines.pop();

    while (this.lines.length) {
      this.push(this.lines.shift());
    }

    callback();
  }

  _flush(callback) {
    this.push(this.linePart);
    callback();
  }
}

module.exports = LineSplitStream;
