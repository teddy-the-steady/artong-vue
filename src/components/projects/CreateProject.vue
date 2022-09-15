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
import {
  FACTORY_ABI,
  FACTORY,
  getPcSigner,
  getWalletConnectSigner
} from '../../contracts'
import { postProject } from '../../api/projects'
import { mapState } from 'vuex'
import { PENDING } from '../../constants'

export default {
  name: 'CreateProject',
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
      policy: 0
    }
  },
  methods: {
    async createProject() {
      let signer = null
      if (this.isMobile) {
        signer = await getWalletConnectSigner() // TODO] tx 지갑에 넘어가고 session_update 이벤트 발생하는 버그. 재현이 잘 안됨..
      } else {
        signer = await getPcSigner()
      }

      const contract = new ethers.Contract(FACTORY, FACTORY_ABI, signer)
      const tx = await contract.createNFTContract(
        this.name,
        this.symbol,
        this.maxAmount,
        this.policy
      )
      console.log('tx:',tx)

      const postResult = await postProject({
        create_tx_hash: tx.hash,
        name: this.name,
        status: PENDING
      })
      console.log(postResult)
      
      if (postResult) {
        this.$router.push({ name: 'CreatingProject', query: { txHash: tx.hash } })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>