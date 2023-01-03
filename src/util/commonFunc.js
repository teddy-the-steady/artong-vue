import { ethers } from 'ethers'
import store from '../store'
import router from '../router'
import Provider from './walletConnectProvider'
import Vue from '../main'

const makeS3Path = function (path) {
  if (path) {
    return `${process.env.VUE_APP_IMAGE_URL}/${path}`
  }
}

const isSessionValid = async function (pathToRedirect) {
  if (await store.dispatch('AUTH_CHECK_CURRENT_SESSION')) {
    return true
  } else {
    loginAndRedirectBack(pathToRedirect)
    return false
  }
}

const loginAndRedirectBack = function (pathToRedirect) {
  router.push({
    name: 'Login',
    query: { redirect: pathToRedirect },
  })
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

const checkMobileWalletStatusAndGetSigner = async function (pathToRedirect) {
  if (Vue.$isMobile()) {
    if (!store.state.wallet.walletStatus) {
      if (await store.dispatch('SET_UP_WALLET_CONNECTION')) {
        return Provider.getWalletConnectSigner()
      } else {
        return null
      }
    } else {
      return Provider.getWalletConnectSigner()
    }
  } else {
    if (
      store.state.user.currentUser.wallet_address !== store.state.wallet.address
    ) {
      await store.dispatch('AUTH_LOGOUT')
      loginAndRedirectBack(pathToRedirect)
      return
    }
    return await Provider.getPcSigner()
  }
}

const shortenAddress = function (address) {
  const result =
    address.substr(0, 6) +
    '...' +
    address.substr(address.length - 4, address.length)
  return result
}

export {
  makeS3Path,
  isSessionValid,
  loginAndRedirectBack,
  getRandomString,
  deepCopy,
  etherToWei,
  weiToEther,
  checkMobileWalletStatusAndGetSigner,
  shortenAddress,
}
