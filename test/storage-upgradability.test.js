/* global describe it artifacts */

import _ from 'lodash'
import { expect } from 'chai'
import { web3 } from './helpers/w3'
import expectRevert from './helpers/expectRevert'

const accounts = web3.eth.accounts

const KeyValueStorage = artifacts.require('KeyValueStorage')
const TokenDelegate = artifacts.require('TokenDelegate')
const TokenLib = artifacts.require('TokenLib')
const MintableTokenDelegate = artifacts.require('MintableTokenDelegate')
const ShrimpCoin = artifacts.require('ShrimpCoin')

describe('Storage and upgradability example', async () => {
  it('should create and upgrade ShrimpCoin', async () => {
    const keyValueStorage = await KeyValueStorage.new()
    const tokenLib = await TokenLib.new()
    TokenDelegate.link('TokenLib', tokenLib.address)
    const tokenDelegate = await TokenDelegate.new()

    // deploys an instance of ShrimpCoin
    let shrimpCoin = await ShrimpCoin.new(keyValueStorage.address)

    // sets shrimpCoin's proxy to use TokenDelegate
    await shrimpCoin.upgradeTo(tokenDelegate.address)

    // extends truffle object to include TokenDelegate functions, which will now
    // be executable via the proxy
    shrimpCoin = _.extend(shrimpCoin, TokenDelegate.at(shrimpCoin.address))

    expect(await shrimpCoin.name()).to.equal('ShrimpCoin')
    expect(await shrimpCoin.symbol()).to.equal('SHRMP')
    expect((await shrimpCoin.decimals()).toNumber()).to.equal(18)

    // deploys a MintableTokenDelegate
    MintableTokenDelegate.link('TokenLib', tokenLib.address)
    const mintableTokenDelegate = await MintableTokenDelegate.new()

    // upgrades shrimpCoin's proxy to use MintableTokenDelegate
    await shrimpCoin.upgradeTo(mintableTokenDelegate.address)

    // extends truffle object to include MintableTokenDelegate functions
    shrimpCoin = _.extend(shrimpCoin, MintableTokenDelegate.at(shrimpCoin.address))

    // mints some tokens to accounts[1] and accounts[2]. Give 'em that shrimp!
    await shrimpCoin.mint(accounts[1], 100 * 10 ** 18)
    await shrimpCoin.mint(accounts[2], 200 * 10 ** 18)

    expect((await shrimpCoin.balanceOf(accounts[1])).toNumber()).to.equal(100 * 10 ** 18)
    expect((await shrimpCoin.balanceOf(accounts[2])).toNumber()).to.equal(200 * 10 ** 18)

    await shrimpCoin.finishMinting()
    expectRevert(shrimpCoin.mint(accounts[1], 100 * 10 ** 18))
  })
})
