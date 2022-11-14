<template>
  <div>
    <div>
      <span>Name</span>
      <input v-model="name" placeholder="name">
    </div>
    <div>
      <span>Symbol</span>
      <input v-model="symbol" placeholder="symbol">
    </div>
    <div>
      <span>Max amount</span>
      <input v-model="maxAmount" placeholder="maxAmount">
    </div>
    <div>
      <span>Policy</span>
      <input type="radio" id="r1" v-model="policy" value="0">
      <label for="r1">Immediate</label>
      <input type="radio" id="r2" v-model="policy" value="1">
      <label for="r2">Approved</label>
    </div>
    <button @click="createProject">CREATE PROJECT</button>
  </div>
</template>

<script>
import { ethers } from 'ethers'
import { mapState } from 'vuex'
import {
  FACTORY_ABI,
  FACTORY,
  getPcSigner,
  getWalletConnectSigner
} from '../../contracts'
import { postProject } from '../../api/projects'
import { PENDING } from '../../constants'
import { headerActivate } from '../../mixin'
// import { isAuthenticated } from '../../util/commonFunc'

export default {
  name: 'CreateProject',
  mixins: [headerActivate],
  computed: {
    ...mapState({
      currentUser: state => state.user.currentUser
    }),
    isMobile() {
      return this.$isMobile()
    }
  },
  data() {
    return {
      name: '',
      symbol: '',
      maxAmount: 0,
      policy: 0,
      signer: null
    }
  },
  methods: {
    async createProject() {
      // if (!isAuthenticated()) {
      // }

      const contract = new ethers.Contract(FACTORY, FACTORY_ABI, this.signer)
      const tx = await this._createNFTContract(contract)

      const postResult = await postProject({
        create_tx_hash: tx.hash,
        name: this.name,
        symbol: this.symbol,
        status: PENDING
      })

      if (postResult) {
        this.$router.push({ name: 'CreatingProject', query: { txHash: tx.hash } })
      }
    },
    async _createNFTContract(contract) {
      const tx = await contract.createNFTContract(
        this.name,
        this.symbol,
        this.maxAmount,
        this.policy
      )
      return tx
    }
  },
  async mounted() {
    if (this.isMobile) {
      this.signer = await getWalletConnectSigner()
    } else {
      this.signer = await getPcSigner()
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
