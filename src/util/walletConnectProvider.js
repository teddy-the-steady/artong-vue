import WalletConnectProvider from '@walletconnect/web3-provider'
import { ethers } from 'ethers'

class Provider {
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
    if (this.pcSigner) {
      return this.pcSigner
    }

    await window.ethereum.request({ method: 'eth_requestAccounts' })
    this.pcProvider = new ethers.providers.Web3Provider(window.ethereum)
    this.pcSigner = this.pcProvider.getSigner()
    return this.pcSigner
  }

  getWalletConnectSigner() {
    if (this.mobileSigner) {
      return this.mobileSigner
    }

    this.mobileProvider = new ethers.providers.Web3Provider(this.provider)
    this.mobileSigner = this.mobileProvider.getSigner()
    return this.mobileSigner
  }
}

export default new Provider()
