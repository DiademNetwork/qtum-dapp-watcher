const { Writable } = require('stream')

/*
    f20b245a781ab35d1a9d5876c7d4fbf5e873637eb1358f3d5e5036ba473164b7
    event Register(address _userAddress, string _userAccount, string _userName);

    7bc59cc544d3629d5593a7a9acdf5c47341b7b5ddb657976540aee69c406b8f4
    event Create(address wallet, string object, string title, bytes32 contentHash);

    50c6b2b9edb343ed62d7689f861bf4bd7e9281efddd632a4e98c0212495aea0c
    event Update(address wallet, string object, string title, bytes32 contentHash, string previousLink);

    44cd04f736ad09845a66019a358898aacdd64afdc1e497dea7cc83f6d81036df
    event Confirm(address wallet, string object, address user);

    261e0d0db30ffb35a16d91f81e5cf5ab8b9689c7f57abaddc664f6b287037d95
    event Support(address wallet, string object, address user, uint256 amount);

    f49cd3f7cf3264bb3d8fab0bb2bff932d82884a6a76cd0fd0bf87f75307d404e
    event Deposit(address wallet, string object, address user, uint256 amount, address witness);

    3ea94497887ad4c70fc4ff8baff84dcfcec6280724df4a61cb094e2d0ea9d5bf
    event Withdraw(address wallet, string object, address user, uint256 amount, address witness);
 */

class GetStream extends Writable {
  constructor(feed, users, qweb3) {
    super({ objectMode: true })

    this.feed = feed
    this.users = users
    this.qweb3 = qweb3

    this.eventHandlers = {
      'Create': this.createAchievement.bind(this),
      'Update': this.updateAchievement.bind(this),
      'Confirm': this.confirmAchievement.bind(this),
      'Support': this.supportAchievement.bind(this),
      'Deposit': this.depositReward.bind(this),
      'Withdraw': this.withdrawReward.bind(this),
      'Register': this.registerUser.bind(this)
    }
  }

  async getUser(address) {
    const [ userAddress, userAccount, userName ] =
      (await this.users.call('getUser', [address])).outputs

    return { userName, userAccount, userAddress }
  }

  async createAchievement(event, time) {
    console.log('createAchievement', event)

    const { userName, userAccount, userAddress } = await this.getUser(event.wallet)
    const qtumAddress = await this.qweb3.fromHexAddress(userAddress)

    const activity = {
      verb: 'create',
      title: event.title,
      wallet: qtumAddress,
      object: event.object,
      contentHash: event.contentHash,
      name: userName,
      actor: userAccount,
      foreign_id: `create_${event.object}`,
      time: time
    }

    await this.feed.addActivity(activity)
  }

  async updateAchievement(event, time) {
    console.log('updateAchievement', event)

    const { userName, userAccount, userAddress } = await this.getUser(event.wallet)
    const qtumAddress = await this.qweb3.fromHexAddress(userAddress)

    const activity = {
      verb: 'update',
      title: event.title,
      wallet: qtumAddress,
      creatorName: userName,
      creatorAccount: userAccount,
      object: event.object,
      contentHash: event.contentHash,
      previousLink: event.previousLink,
      name: userName,
      actor: userAccount,
      foreign_id: `update_${event.object}`,
      time: time
    }

    await this.feed.addActivity(activity)
  }

  async confirmAchievement(event, time) {
    console.log('confirmAchievement', event)

    const {
      userAccount: creatorAccount,
      userName: creatorName,
      userAddress: creatorAddress
    } = await this.getUser(event.wallet)

    const {
      userAccount: witnessAccount,
      userName: witnessName,
      userAddress: witnessAddress
    } = await this.getUser(event.user)

    const creatorQtumAddress = await this.qweb3.fromHexAddress(creatorAddress)
    const witnessQtumAddress = await this.qweb3.fromHexAddress(witnessAddress)

    const activity = {
      verb: 'confirm',
      wallet: creatorQtumAddress,
      creatorName: creatorName,
      creatorAccount: creatorAccount,
      object: event.object,
      actor: witnessAccount,
      name: witnessName,
      address: witnessQtumAddress,
      witness: witnessAccount,
      witnessName: witnessName,
      witnessAddress: witnessQtumAddress,
      foreign_id: `confirm_${event.object}`,
      time: time
    }

    await this.feed.addActivity(activity)
  }

  async supportAchievement(event, time) {
    console.log('supportAchievement', event)

    const {
      userAccount: creatorAccount,
      userName: creatorName,
      userAddress: creatorAddress
    } = await this.getUser(event.wallet)

    const {
      userAccount: sponsorAccount,
      userName: sponsorName,
      userAddress: sponsorAddress
    } = await this.getUser(event.user)

    const creatorQtumAddress = await this.qweb3.fromHexAddress(creatorAddress)
    const sponsorQtumAddress = await this.qweb3.fromHexAddress(sponsorAddress)

    const activity = {
      verb: 'support',
      wallet: creatorQtumAddress,
      creatorName: creatorName,
      creatorAccount: creatorAccount,
      object: event.object,
      amount: event.amount,
      actor: sponsorAccount,
      name: sponsorName,
      address: sponsorQtumAddress,
      foreign_id: `support_${event.object}`,
      time: time
    }

    await this.feed.addActivity(activity)
  }

  async depositReward(event, time) {
    console.log('depositReward', event)

    const {
      userAccount: creatorAccount,
      userName: creatorName,
      userAddress: creatorAddress
    } = await this.getUser(event.wallet)
    const qtumAddressCreator = await this.qweb3.fromHexAddress(creatorAddress)

    const {
      userAccount: sponsorAccount,
      userName: sponsorName,
      userAddress: sponsorAddress
    } = await this.getUser(event.user)
    const qtumAddressSponsor = await this.qweb3.fromHexAddress(sponsorAddress)

    const {
      userAccount: witnessAccount,
      userName: witnessName,
      userAddress: witnessAddress
    } = await this.getUser(event.witness)
    const qtumAddressWitness = await this.qweb3.fromHexAddress(witnessAddress)

    const activity = {
      verb: 'deposit',
      wallet: qtumAddressCreator,
      creatorName: creatorName,
      creatorAccount: creatorAccount,
      object: event.object,
      amount: event.amount,
      actor: sponsorAccount,
      name: sponsorName,
      address: qtumAddressSponsor,
      witness: witnessAccount,
      witnessName: witnessName,
      witnessAddress: qtumAddressWitness,
      foreign_id: `deposit_${event.object}`,
      time: time
    }

    await this.feed.addActivity(activity)
  }

  async withdrawReward(event, time) {
    console.log('withdrawReward', event)

    const {
      userAccount: creatorAccount,
      userName: creatorName,
      userAddress: creatorAddress
    } = await this.getUser(event.wallet)
    const qtumAddressCreator = await this.qweb3.fromHexAddress(creatorAddress)

    const {
      userAccount: sponsorAccount,
      userName: sponsorName,
      userAddress: sponsorAddress
    } = await this.getUser(event.user)
    const qtumAddressSponsor = await this.qweb3.fromHexAddress(sponsorAddress)

    const {
      userAccount: witnessAccount,
      userName: witnessName,
      userAddress: witnessAddress
    } = await this.getUser(event.witness)
    const qtumAddressWitness = await this.qweb3.fromHexAddress(witnessAddress)

    const activity = {
      verb: 'withdraw',
      wallet: qtumAddressCreator,
      creatorName: creatorName,
      creatorAccount: creatorAccount,
      object: event.wallet,
      amount: event.amount,
      actor: sponsorAccount,
      name: sponsorName,
      address: qtumAddressSponsor,
      witness: witnessAccount,
      witnessName: witnessName,
      witnessAddress: qtumAddressWitness,
      foreign_id: `withdraw_${event.object}`,
      time: time
    }

    await this.feed.addActivity(activity)
  }

  async registerUser(event) {
    console.log('registerUser', event)
  }

  async _write(chunk, encoding, callback) {
    if (chunk.log && chunk.log[0]) {
      const event = chunk.log[0]
      const eventName = event._eventName
      const gasUsed = chunk.gasUsed

      console.log(`${eventName} gas: ${gasUsed}`)

      if (this.eventHandlers[eventName]) {
        try {
          const time = new Date(chunk.blockNumber) // to enforce uniqueness in feed
          await this.eventHandlers[eventName](event, time)
          callback()
        } catch (e) {
          console.error(e.message)
          callback()
        }
      }
    }
  }
}

module.exports = GetStream
