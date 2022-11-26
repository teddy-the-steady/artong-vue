import { ethers } from 'ethers'
import store from '../store'

const makeS3Path = function (path) {
  if (path) {
    return `${process.env.VUE_APP_IMAGE_URL}/${path}`
  }
}

const isAuthenticated = function () {
  if (store.state.auth.status === 'success') {
    return true
  }
  return false
}

const getRandomString = function (bytes) {
  const randomValues = new Uint8Array(bytes)
  window.crypto.getRandomValues(randomValues)
  return Array.from(randomValues).map(intToHex).join('')
}

const intToHex = function (nr) {
  return nr.toString(16).padStart(2, '0')
}

const deepCopy = function (obj) {
  return JSON.parse(JSON.stringify(obj))
}

const etherToWei = function (ether) {
  return ethers.utils.parseUnits(ether, 'ether')
}

const weiToEther = function (wei) {
  return ethers.utils.formatEther(wei)
}

export {
  makeS3Path,
  isAuthenticated,
  getRandomString,
  deepCopy,
  etherToWei,
  weiToEther,
}
