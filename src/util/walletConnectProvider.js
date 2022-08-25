import WalletConnectProvider from '@walletconnect/web3-provider'

class Provider {
  constructor() {
    this.provider = new WalletConnectProvider({
      infuraId: process.env.VUE_APP_INFURA_ID,
    })
  }

  resetProvider() {
    this.provider = new WalletConnectProvider({
      infuraId: process.env.VUE_APP_INFURA_ID
    })
  }
}

export default new Provider()
