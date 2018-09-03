import Web3 from 'web3'
import contract from 'truffle-contract'

import { networks } from './truffle'
import Counter from './build/contracts/Counter.json'

const { web3 } = window

let web3Instance
export const getWeb3 = () => new Promise((resolve, reject) => {
  if (web3Instance) {
    resolve(web3Instance)
    return
  }

  window.addEventListener('load', () => {
    // if (process.env.NODE_ENV === 'production' && typeof web3 !== 'undefined') {
    if (typeof web3 !== 'undefined') {
      console.log('Injected web3 detected.')
      web3Instance = new Web3(web3.currentProvider)
      resolve(web3Instance)
      return
    }

    console.log('No web3 instance injected, using Local web3.')
    const { host, port } = (networks && networks.development) || {}
    console.log(host, port);
    const providerUrl = process.env.PROVIDER_URL || `http://${host}:${port}`
    const provider = new Web3.providers.HttpProvider(providerUrl)

    web3Instance = new Web3(provider)
    resolve(web3Instance)
  })
})

let counter
export const getContract = () => new Promise((resolve, reject) => {
  if (!web3Instance) {
    reject('Web3 not provided')
    return
  }

  if (counter) {
    resolve(counter)
    return
  }

  const counterContract = contract(Counter)
  counterContract.setProvider(web3Instance.currentProvider)
  if (typeof counterContract.currentProvider.sendAsync !== 'function') {
    counterContract.currentProvider.sendAsync = function() {
      return counterContract.currentProvider.send.apply(counterContract.currentProvider, arguments)
    }
  }

  counterContract.deployed()
    .then((instance) => {
      console.info('counter contract initiation completed')
      counter = instance
      resolve(counter)
    })
    .catch(reject)
})

export const weiToEther = (wei) => wei / 1000000000000000000

export const etherToWei = (ether) => ether * 1000000000000000000
