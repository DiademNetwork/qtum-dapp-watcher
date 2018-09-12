const { Writable } = require('stream')

class GetStream extends Writable {
  constructor() {
    super({ objectMode: true })

    this.eventHandlers = {
      'Create': this.createAchievement,
      'Update': this.updateAchievement,
      'Confirm': this.confirmAchievement,
      'Support': this.supportAchievement,
      'Deposit': this.depositReward
    }
  }

  createAchievement(event, callback) {
    console.log(event)
    callback()
  }

  _write(chunk, encoding, callback) {
    if (chunk.log && chunk.log[0]) {
      const event = chunk.log[0]
      const eventName = event._eventName

      if (this.eventHandlers[eventName]) {
        this.eventHandlers[eventName](event, callback)
      }
    }
  }
}

module.exports = GetStream
