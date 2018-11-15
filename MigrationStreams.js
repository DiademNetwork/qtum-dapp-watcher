const { Transform, Writable } = require("stream")
const fs = require("fs")

class MigrationPrepareStream extends Transform {
  constructor() {
    super({ objectMode: true })
  }

  _transform(data, encoding, callback) {
    if (data.log.length > 0) {
      for (const event of data.log) {
        this.push(JSON.stringify(event).concat(','))
      }
    }
    callback()
  }
}

const prepareStream = () => {
  return new MigrationPrepareStream()
}
const saveStream = (filename) => {
  return fs.createWriteStream(filename)
}

module.exports = {
  prepareStream, saveStream
}
