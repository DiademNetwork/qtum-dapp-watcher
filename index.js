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

const USERS_ADDRESS = '32b91b1a2df904a9764a2d699dfa08f57d3892b1'
const ACHIEVEMENTS_ADDRESS = '41d6a2601f7293507fa78f9959eebbe34fe37d59'
const REWARDS_ADDRESS = '0452450eb9cec5a3fde7ec1b02fe708ce03272c4'

const CREATE_EVENT = 'f66295d6a0af54f6a9fcc0addd996e721e7f4f1d5d5813bffbeebafb015c2bc6'
const UPDATE_EVENT = '9268fea11ef6e9bff17d2c28ffc9a8c0bc7453eaa04d16880f2e4ed4db55e203'
const CONFIRM_EVENT = '161eac8776ddec246f2dfe4fa6eef584bca9e3996315ee61c2a8d7941569882c'
const SUPPORT_EVENT = '03f53925071bc20ec16b44abf351ff310e30b0bdf12ef52ac966a0488da3a085'
const DEPOSIT_EVENT = '182fa52899142d44ff5c45a6354d3b3e868d5b07db6a65580b39bd321bdaf8ac'
const WITHDRAW_EVENT = '244357ef985e4838e46c063590f65f43f90e7c0dbbe451022be3d2e242bf7fd9'

const addresses = [USERS_ADDRESS, ACHIEVEMENTS_ADDRESS, REWARDS_ADDRESS]
const topics = [CREATE_EVENT, UPDATE_EVENT, CONFIRM_EVENT, SUPPORT_EVENT, DEPOSIT_EVENT, WITHDRAW_EVENT]

const startBlock = 0

const reduce = () => {
  (new EventsStream(qweb3, addresses, topics, metadata, startBlock))
    .pipe(new GetStream())
}
reduce()
