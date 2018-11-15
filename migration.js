require('dotenv').config()

const { Qweb3 } = require('qweb3')

const EventsCacheStream = require('./EventsCacheStream')
const { prepareStream, saveStream } = require('./MigrationStreams')

const qtumRepository = require('./solar.development.json')
const qweb3 = new Qweb3(process.env.QTUM_RPC_ADDRESS)

const USERS_CONTRACT = qtumRepository.contracts['contracts/Users.sol']
const ACHIEVEMENTS_CONTRACT = qtumRepository.contracts['contracts/Achievements.sol']
const REWARDS_CONTRACT = qtumRepository.contracts['contracts/Rewards.sol']

const USERS_ADDRESS = USERS_CONTRACT.address
const ACHIEVEMENTS_ADDRESS = ACHIEVEMENTS_CONTRACT.address
const REWARDS_ADDRESS = REWARDS_CONTRACT.address

const REGISTER_EVENT = 'f20b245a781ab35d1a9d5876c7d4fbf5e873637eb1358f3d5e5036ba473164b7'
const CREATE_EVENT = '7bc59cc544d3629d5593a7a9acdf5c47341b7b5ddb657976540aee69c406b8f4'
const UPDATE_EVENT = '50c6b2b9edb343ed62d7689f861bf4bd7e9281efddd632a4e98c0212495aea0c'
const CONFIRM_EVENT = '44cd04f736ad09845a66019a358898aacdd64afdc1e497dea7cc83f6d81036df'
const SUPPORT_EVENT = '261e0d0db30ffb35a16d91f81e5cf5ab8b9689c7f57abaddc664f6b287037d95'
const DEPOSIT_EVENT = 'f49cd3f7cf3264bb3d8fab0bb2bff932d82884a6a76cd0fd0bf87f75307d404e'
const WITHDRAW_EVENT = '3ea94497887ad4c70fc4ff8baff84dcfcec6280724df4a61cb094e2d0ea9d5bf'

const processes = [{
  name: 'Register',
  metadata: USERS_CONTRACT,
  address: USERS_ADDRESS,
  topic: REGISTER_EVENT
}, {
  name: 'Create',
  metadata: ACHIEVEMENTS_CONTRACT,
  address: ACHIEVEMENTS_ADDRESS,
  topic: CREATE_EVENT
}, {
  name: 'Update',
  metadata: ACHIEVEMENTS_CONTRACT,
  address: ACHIEVEMENTS_ADDRESS,
  topic: UPDATE_EVENT
}, {
  name: 'Confirm',
  metadata: ACHIEVEMENTS_CONTRACT,
  address: ACHIEVEMENTS_ADDRESS,
  topic: CONFIRM_EVENT
}, {
  name: 'Support',
  metadata: REWARDS_CONTRACT,
  address: REWARDS_ADDRESS,
  topic: SUPPORT_EVENT
}, {
  name: 'Deposit',
  metadata: REWARDS_CONTRACT,
  address: REWARDS_ADDRESS,
  topic: DEPOSIT_EVENT
}, {
  name: 'Withdraw',
  metadata: REWARDS_CONTRACT,
  address: REWARDS_ADDRESS,
  topic: WITHDRAW_EVENT
}]

const startBlock = 0
const migrationFilename = 'migration.json'

const reduce = () => {
  (new EventsCacheStream(qweb3, processes, startBlock, false))
    .pipe(prepareStream())
    .pipe(saveStream(migrationFilename))
}
reduce()
