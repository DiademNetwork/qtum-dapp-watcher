require('dotenv').config()

const { Qweb3 } = require('qweb3')
const EventsStream = require('./EventsStream')
const GetStream = require('./GetStream')

const qweb3 = new Qweb3(process.env.QTUM_RPC_ADDRESS)

const qtumRepository = require('./solar.development.json')

const metadata = []
metadata.push(qtumRepository.contracts['contracts/Achievements.sol'])
metadata.push(qtumRepository.contracts['contracts/Users.sol'])
metadata.push(qtumRepository.contracts['contracts/Rewards.sol'])

const USERS_ADDRESS = 'e867e1d9901149fbf3b524bd442a70b4be24e62e'
const ACHIEVEMENTS_ADDRESS = '8c5829dff0aa35dce35ecb18e38c7c4d24cb6abf'
const REWARDS_ADDRESS = 'eaa89cfca2c3bdd2821c5895284b6ffc78cf41bb'

const CREATE_EVENT = 'b27bb48959e661e2ff2784657a44fb5baa6c91210a608d6f656f51820a9bb528'
const CONFIRM_EVENT = '7e4ffcac6fa826e0c6a913bd1c497d42d7cbb614da8c2e5a3314591cbcc81d9b'
const SUPPORT_EVENT = '03f53925071bc20ec16b44abf351ff310e30b0bdf12ef52ac966a0488da3a085'
const DEPOSIT_EVENT = '182fa52899142d44ff5c45a6354d3b3e868d5b07db6a65580b39bd321bdaf8ac'
const WITHDRAW_EVENT = '244357ef985e4838e46c063590f65f43f90e7c0dbbe451022be3d2e242bf7fd9'

const addresses = [USERS_ADDRESS, ACHIEVEMENTS_ADDRESS, REWARDS_ADDRESS]
const topics = [CREATE_EVENT, CONFIRM_EVENT, SUPPORT_EVENT, DEPOSIT_EVENT, WITHDRAW_EVENT]

const startBlock = 0

const reduce = () => {
  (new EventsStream(qweb3, addresses, topics, metadata, startBlock))
    .pipe(new GetStream())
}
reduce()
