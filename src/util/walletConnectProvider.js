import WalletConnectProvider from '@walletconnect/web3-provider'
import { ethers } from 'ethers'

class Provider {
  pcProvider
  mobileProvider

  constructor() {
    this.provider = new WalletConnectProvider({
      infuraId: process.env.VUE_APP_INFURA_ID,
      qrcodeModalOptions: {
        mobileLinks: ['metamask', 'rainbow'],
      },
    })
  }

  resetProvider() {
    this.provider = new WalletConnectProvider({
      infuraId: process.env.VUE_APP_INFURA_ID,
      qrcodeModalOptions: {
        mobileLinks: ['metamask', 'rainbow'],
      },
    })
  }

  async getPcSigner() {
    await window.ethereum.request({ method: 'eth_requestAccounts' })
    this.pcProvider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = this.pcProvider.getSigner()
    return signer
  }

  getWalletConnectSigner() {
    this.mobileProvider = new ethers.providers.Web3Provider(Provider.provider)
    const signer = this.mobileProvider.getSigner()
    return signer
  }
}

export default new Provider()
