require('dotenv').config()

const { Qweb3 } = require('qweb3')
const { Qtum } = require('qtumjs')
const stream = require('getstream')

const EventsStream = require('./EventsStream')
const GetStream = require('./GetStream')

const client = stream.connect(process.env.STREAM_KEY, process.env.STREAM_SECRET)
const feed = client.feed(process.env.STREAM_ACHIEVEMENTS_GROUP, process.env.STREAM_ACHIEVEMENTS_GROUP)

const qweb3 = new Qweb3(process.env.QTUM_RPC_ADDRESS)

const qtumRepository = require('./solar.development.json')

const qtum = new Qtum(process.env.QTUM_RPC_ADDRESS, qtumRepository)
const users = qtum.contract('contracts/Users.sol')

const metadata = []
metadata.push(qtumRepository.contracts['contracts/Achievements.sol'])
metadata.push(qtumRepository.contracts['contracts/Users.sol'])
metadata.push(qtumRepository.contracts['contracts/Rewards.sol'])

const USERS_ADDRESS = '39160eca6e4d767b536c8f4569f8124883ebc061'
const ACHIEVEMENTS_ADDRESS = '847b66a424b3c20d5469ef754bcee21aae76b7b2'
const REWARDS_ADDRESS = 'd0b651014ae8df23d81b1447eb0cf4810601fa39'

const REGISTER_EVENT = 'f20b245a781ab35d1a9d5876c7d4fbf5e873637eb1358f3d5e5036ba473164b7'
const CREATE_EVENT = '7bc59cc544d3629d5593a7a9acdf5c47341b7b5ddb657976540aee69c406b8f4'
const UPDATE_EVENT = '50c6b2b9edb343ed62d7689f861bf4bd7e9281efddd632a4e98c0212495aea0c'
const CONFIRM_EVENT = '44cd04f736ad09845a66019a358898aacdd64afdc1e497dea7cc83f6d81036df'
const SUPPORT_EVENT = '261e0d0db30ffb35a16d91f81e5cf5ab8b9689c7f57abaddc664f6b287037d95'
const DEPOSIT_EVENT = 'f49cd3f7cf3264bb3d8fab0bb2bff932d82884a6a76cd0fd0bf87f75307d404e'
const WITHDRAW_EVENT = 'a07ba11b741df64fca8ef3b0cd4e4a4da6a481976bf4dd7db782835c2480f64a'

const addresses = [ACHIEVEMENTS_ADDRESS]
const topics = [CREATE_EVENT, UPDATE_EVENT]

const startBlock = 0

const reduce = () => {
  (new EventsStream(qweb3, addresses, topics, metadata, startBlock))
    .pipe(new GetStream(feed, users))
}
reduce()
