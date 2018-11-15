const { Readable } = require('stream');

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class EventsCacheStream extends Readable {
  constructor(qweb3, processes, startBlock) {
    super({ objectMode: true })

    this.eventsTemp = []
    this.events = []

    const loadEvents = async (fromBlock, toBlock, address, topic, metadata, name) => {
      const events = await qweb3.searchLogs(fromBlock, toBlock, [address], [topic], [metadata], true)

      console.log(`${name} ${toBlock}: `, events.length)

      for (const event of events) {
        this.eventsTemp.push(event)
      }
    }

    (async () => {
      const blockNumber = await qweb3.getBlockCount()

      let fromBlock = startBlock
      let toBlock = blockNumber

      for (const process of processes) {
        await loadEvents(fromBlock, toBlock, process.address, process.topic, process.metadata, process.name)
      }

      const eventsSequence = {
        'Register': 1,
        'Create': 2,
        'Update': 3,
        'Confirm': 4,
        'Support': 5,
        'Deposit': 6,
        'Withdraw': 7
      }

      this.events = this.eventsTemp.sort((a, b) => {
        if (a.blockNumber < b.blockNumber) {
          return -1
        } else if (a.blockNumber > b.blockNumber) {
          return 1
        } else {
          const aPriority = eventsSequence[a.log[0]._eventName]
          const bPriority = eventsSequence[b.log[0]._eventName]

          if (aPriority < bPriority) {
            return -1
          } else if (aPriority > bPriority) {
            return 1
          } else {
            return 0
          }
        }
      })

      this.events.forEach((event) => {
        this.push(event)
      })
    })()
  }

  _read() {
  }
}

module.exports = EventsCacheStream
