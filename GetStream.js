const { Writable } = require('stream')

class GetStream extends Writable {
  constructor(feed) {
    super({ objectMode: true })

    this.feed = feed

    this.eventHandlers = {
      'Create': this.createAchievement,
      'Update': this.updateAchievement,
      'Confirm': this.confirmAchievement,
      'Support': this.supportAchievement,
      'Deposit': this.depositReward
    }
  }

  async createAchievement(event) {
    console.log('createAchievement', event)
    await this.feed.addActivity(event)
  }

  async updateAchievement(event) {
    console.log('updateAchievement', event)
    await this.feed.addActivity(event)
  }

  async confirmAchievement(event) {
    console.log('confirmAchievement', event)
    await this.feed.addActivity(event)
  }

  async supportAchievement(event) {
    console.log('supportAchievement', event)
    await this.feed.addActivity(event)
  }

  async depositReward(event) {
    console.log('depositReward', event)
    await this.feed.addActivity(event)
  }

  async _write(chunk, encoding, callback) {
    if (chunk.log && chunk.log[0]) {
      const event = chunk.log[0]
      const eventName = event._eventName

      if (this.eventHandlers[eventName]) {
        await this.eventHandlers[eventName](event)
        callback()
      }
    }
  }
}

module.exports = GetStream
