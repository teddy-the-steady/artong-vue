import { ethers } from 'ethers'
import Provider from '../util/walletConnectProvider'

export * from './abi'
export * from './constants'
export * from './LazyMinter'
// export * from './marketplace';
// export * from './factory';
// export * from './token';

export const getPcSigner = async () => {
  await window.ethereum.request({ method: 'eth_requestAccounts' })
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const signer = provider.getSigner()
  return signer
}

export const getWalletConnectSigner = async () => {
  const provider = new ethers.providers.Web3Provider(Provider.provider)
  const signer = provider.getSigner()
  return signer
}
