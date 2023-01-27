<template>
  <div class="info-area">
    <div class="info">
      <div>
        <span class="label">Artong balance</span>
        <span class="balance">{{ `${'??'} ETH` }}</span>
      </div>
      <div>
        <span class="label">Offer balance</span>
        <span class="balance">{{ `${offerBalance} ETH` }}</span>
      </div>
      <div>
        <span class="label">Withdrawable</span>
        <span class="balance">
          {{ `${artongBalance} ETH` }}
        </span>
      </div>
      <button v-ripple @click="withdraw">
        <div class="spinner" :class="{ active: withdrawing }"></div>
        <span v-show="!withdrawing">WITHDRAW</span>
      </button>
    </div>
    <button
      class="round-button white-button ripple refresh"
      :class="{ refreshing: refreshing }"
      @click="refresh"
    >
      <img src="@/assets/icons/refresh.svg" />
    </button>
  </div>
</template>

<script>
import { ethers } from 'ethers'
import { mapState } from 'vuex'
import { MARKETPLACE_ABI, MARKETPLACE } from '../../contracts'
import {
  isSessionValid,
  checkMobileWalletStatusAndGetSigner,
  weiToEther,
} from '../../util/commonFunc'
import Provider from '../../util/walletConnectProvider'
import Ripple from '../../directives/ripple/Ripple'

export default {
  name: 'SidebarInfoArea',
  computed: {
    ...mapState({
      currentUser: state => state.user.currentUser,
    }),
  },
  data() {
    return {
      artongBalance: 0,
      offerBalance: 0,
      withdrawing: false,
      refreshing: false,
    }
  },
  methods: {
    async refresh() {
      if (!(await isSessionValid(this.$router.currentRoute.fullPath))) {
        return
      }

      this.signer = await checkMobileWalletStatusAndGetSigner(
        this.$router.currentRoute.fullPath,
      )
      if (!this.signer) {
        return
      }

      const contract = new ethers.Contract(
        MARKETPLACE,
        MARKETPLACE_ABI,
        this.signer,
      )

      try {
        this.refreshing = true
        const [artongBalance, offerBalance] = await Promise.all([
          this.getArtongBalance(contract),
          this.getOfferBalance(contract),
        ])

        this.artongBalance = weiToEther(artongBalance._hex)
        this.offerBalance = weiToEther(offerBalance._hex)
      } finally {
        this.refreshing = false
      }
    },
    getArtongBalance(contract) {
      return contract.getArtongBalance(
        parseInt(Date.now() / 1000),
        this.currentUser.wallet_address,
      )
    },
    getOfferBalance(contract) {
      return contract.getOfferBalance(
        parseInt(Date.now() / 1000),
        this.currentUser.wallet_address,
      )
    },
    async withdraw() {
      if (!(await isSessionValid(this.$router.currentRoute.fullPath))) {
        return
      }

      this.signer = await checkMobileWalletStatusAndGetSigner(
        this.$router.currentRoute.fullPath,
      )
      if (!this.signer) {
        return
      }

      const contract = new ethers.Contract(
        MARKETPLACE,
        MARKETPLACE_ABI,
        this.signer,
      )

      try {
        this.withdrawing = true
        const tx = await contract.populateTransaction.withdraw()
        const txHash = await this.signer.sendUncheckedTransaction(tx)
        await this.wait(txHash)
        alert('Withdraw complete! Please go check your wallet')
        this.refresh()
      } finally {
        this.withdrawing = false
      }
    },
    async wait(txHash) {
      if (this.isMobile) {
        return await Provider.mobileProvider.waitForTransaction(txHash)
      } else {
        return await Provider.pcProvider.waitForTransaction(txHash)
      }
    },
  },
  directives: {
    ripple: Ripple,
  },
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/variables';

.info-area {
  display: flex;
  justify-content: space-between;
  padding: 50px;
  .info {
    width: 120px;
    max-width: 150px;
    div {
      margin-bottom: 10px;
      .label {
        font-family: $item-font;
        font-style: $item-font-style;
        font-size: 14px;
      }
      .balance {
        font-family: $item-font;
        font-style: $item-font-style;
        font-size: 20px;
        display: block;
      }
    }

    button {
      width: 100%;
      .spinner {
        display: none;

        &.active {
          display: inline-block;
          position: relative;
          width: 2px;
          margin: 0px auto;
          animation: rotation 0.6s infinite linear;
          border-left: 6px solid rgba(0, 174, 239, 0.15);
          border-right: 6px solid rgba(0, 174, 239, 0.15);
          border-bottom: 6px solid rgba(0, 174, 239, 0.15);
          border-top: 6px solid $artong-white;
          border-radius: 100%;
        }
      }

      @keyframes rotation {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(359deg);
        }
      }
      button {
        width: 100%;
      }

      & > span:nth-child(2) {
        align-self: center;
      }
    }
  }

  .refresh {
    top: -24px;
    &.refreshing {
      img {
        animation: rotation 0.6s infinite linear;
      }
    }
  }
}
</style>
