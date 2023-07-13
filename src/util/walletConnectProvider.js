import { EthereumProvider } from '@walletconnect/ethereum-provider'
import { ethers } from 'ethers'

class Provider {
  METAMASK_ID =
    'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96'
  RAINBOW_WALLET_ID =
    '1ae92b26df02f0abca6304df07debccd18262fdf5fe82daa81593582dac9a369'

  MAINNET = 1
  GOERLI = 5

  constructor() {
    this.providerPromise = EthereumProvider.init({
      projectId: process.env.VUE_APP_WALLETCONNECT_PROJECT_ID,
      chains: [
        process.env.NODE_ENV === 'production' ? this.MAINNET : this.GOERLI,
      ],
      showQrModal: true,
      qrModalOptions: {
        explorerExcludedWalletIds: 'ALL',
        explorerRecommendedWalletIds: [
          this.METAMASK_ID,
          this.RAINBOW_WALLET_ID,
        ],
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

  async getWalletConnectSigner() {
    if (this.mobileSigner) {
      return this.mobileSigner
    }

    this.mobileProvider = new ethers.providers.Web3Provider(
      await this.providerPromise,
    )
    this.mobileSigner = this.mobileProvider.getSigner()
    return this.mobileSigner
  }

  async setWalletConnectSigner() {
    this.mobileProvider = new ethers.providers.Web3Provider(
      await this.providerPromise,
    )
    this.mobileSigner = this.mobileProvider.getSigner()
  }
}

export default new Provider()
