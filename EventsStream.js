const { Readable } = require('stream');

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class EventsStream extends Readable {
  constructor(qweb3, processes, startBlock, blockPerBlock = false) {
    super({ objectMode: true })

    const loadEvents = async (fromBlock, toBlock, address, topic, metadata, name) => {
      const events = await qweb3.searchLogs(fromBlock, toBlock, [address], [topic], [metadata], true)

      console.log(`${name} ${toBlock}: `, events.length)

      for (const event of events) {
        this.push(event)
      }
    }

    (async () => {
      const blockNumber = await qweb3.getBlockCount()

      let fromBlock = startBlock
      let toBlock = blockNumber
      if (blockPerBlock === true) {
        toBlock = fromBlock
      }

      for (const process of processes) {
        await loadEvents(fromBlock, toBlock, process.address, process.topic, process.metadata, process.name)
      }

      while (true) {
        const blockNumber = await qweb3.getBlockCount()

        if (blockNumber > toBlock) {
          fromBlock = toBlock + 1
          if (blockPerBlock === true) {
            toBlock = fromBlock
          } else {
            toBlock = blockNumber
          }

          for (const process of processes) {
            await loadEvents(fromBlock, toBlock, process.address, process.topic, process.metadata, process.name)
          }
        } else {
          await sleep(1000)
        }
      }
    })()
  }

  _read() {
  }
}

module.exports = EventsStream
