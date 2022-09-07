import { ethers } from 'ethers'

export * from './abi';
export * from './constants'
// export * from './marketplace';
// export * from './factory';
// export * from './token';

export const getSigner = async () => {
  // await window.ethereum.request({ method: 'eth_requestAccounts' })
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const signer = provider.getSigner()
  return signer
};