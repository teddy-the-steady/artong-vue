import WalletConnect from "@walletconnect/client"
import QRCodeModal from "@walletconnect/qrcode-modal"
import Vue from 'vue'

const setUpMobileWalletConnect = function() {
  Vue.prototype.$walletConnect = new WalletConnect({
    bridge: 'https://bridge.walletconnect.org',
    qrcodeModal: QRCodeModal,
  })

  Vue.prototype.$walletConnect.on('session_update', async (error, payload) => {
    if (error) {
      throw error
    }
    const { accounts } = payload.params[0]
    if (accounts.length > 0) {
      await this.$store.dispatch('AUTH_LOGOUT')
      this.$router.go(this.$router.currentRoute)
    }
  })

  return Vue.prototype.$walletConnect
}

export {
  setUpMobileWalletConnect
}
