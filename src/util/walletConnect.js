import WalletConnect from "@walletconnect/client"
import QRCodeModal from "@walletconnect/qrcode-modal"
import Vue from 'vue'

const setUpMobileWalletConnect = function() {
  console.log('setUpMobileWalletConnect')
  const connector = new WalletConnect({
    bridge: 'https://bridge.walletconnect.org',
    qrcodeModal: QRCodeModal,
  })

  connector.on('session_update', async (error, payload) => {
    if (error) {
      throw error
    }
    const { accounts } = payload.params[0]
    console.log('come on!', accounts)
    if (accounts.length > 0) {
      console.log('in?!?!?!')
      await this.$store.dispatch('AUTH_LOGOUT')
      this.$router.go(this.$router.currentRoute)
    }
  })

  Vue.prototype.$walletConnect = connector
  return connector
}

export {
  setUpMobileWalletConnect
}
