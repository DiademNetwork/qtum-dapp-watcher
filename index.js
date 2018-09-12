require('dotenv').config()

const { Qweb3 } = require('qweb3')
const stream = require('getstream')

const EventsStream = require('./EventsStream')
const GetStream = require('./GetStream')

const client = stream.connect(process.env.STREAM_KEY, process.env.STREAM_SECRET)
const feed = client.feed(process.env.STREAM_TRANSACTIONS_GROUP, process.env.STREAM_TRANSACTIONS_FEED)

const qweb3 = new Qweb3(process.env.QTUM_RPC_ADDRESS)

const qtumRepository = require('./solar.development.json')

const metadata = []
metadata.push(qtumRepository.contracts['contracts/Achievements.sol'])
metadata.push(qtumRepository.contracts['contracts/Users.sol'])
metadata.push(qtumRepository.contracts['contracts/Rewards.sol'])

const USERS_ADDRESS = 'e867e1d9901149fbf3b524bd442a70b4be24e62e'
const ACHIEVEMENTS_ADDRESS = '8c5829dff0aa35dce35ecb18e38c7c4d24cb6abf'
const REWARDS_ADDRESS = 'eaa89cfca2c3bdd2821c5895284b6ffc78cf41bb'

const REGISTER_EVENT = 'f20b245a781ab35d1a9d5876c7d4fbf5e873637eb1358f3d5e5036ba473164b7'
const CREATE_EVENT = '7bc59cc544d3629d5593a7a9acdf5c47341b7b5ddb657976540aee69c406b8f4'
const UPDATE_EVENT = '50c6b2b9edb343ed62d7689f861bf4bd7e9281efddd632a4e98c0212495aea0c'
const CONFIRM_EVENT = '44cd04f736ad09845a66019a358898aacdd64afdc1e497dea7cc83f6d81036df'
const SUPPORT_EVENT = '261e0d0db30ffb35a16d91f81e5cf5ab8b9689c7f57abaddc664f6b287037d95'
const DEPOSIT_EVENT = 'f49cd3f7cf3264bb3d8fab0bb2bff932d82884a6a76cd0fd0bf87f75307d404e'
const WITHDRAW_EVENT = 'a07ba11b741df64fca8ef3b0cd4e4a4da6a481976bf4dd7db782835c2480f64a'

const addresses = [USERS_ADDRESS, ACHIEVEMENTS_ADDRESS, REWARDS_ADDRESS]
const topics = [CREATE_EVENT, UPDATE_EVENT, CONFIRM_EVENT, SUPPORT_EVENT, DEPOSIT_EVENT, WITHDRAW_EVENT, REGISTER_EVENT]

const startBlock = 0

const reduce = () => {
  (new EventsStream(qweb3, addresses, topics, metadata, startBlock))
    .pipe(new GetStream(feed))
}
reduce()
