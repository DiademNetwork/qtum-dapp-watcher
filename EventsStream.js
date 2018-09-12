const { Readable } = require('stream');

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class EventsStream extends Readable {
  constructor(qweb3, addresses, topics, metadata, startBlock) {

    super({ objectMode: true })

    const loadEvents = async (fromBlock, toBlock) => {
      const events = await qweb3.searchLogs(fromBlock, toBlock, addresses, topics, metadata, true)

      console.log('events', events)

      for (const event of events) {
        if (!this.push(event)) {
          await new Promise(resolve => this._resume = resolve)
        }
      }
    }

    (async () => {
      const blockNumber = await qweb3.getBlockCount()

      let fromBlock = startBlock
      let toBlock = blockNumber

      await loadEvents(fromBlock, toBlock)

      while (true) {
        const blockNumber = await qweb3.getBlockCount()

        if (blockNumber > toBlock) {
          fromBlock = toBlock + 1
          toBlock = blockNumber
          await loadEvents(fromBlock, toBlock)
        } else {
          await sleep(1000)
        }
      }
    })()
  }

  _read() {
    const resume = this._resume
    delete this._resume
    resume && resume()
  }
}

module.exports = EventsStream
