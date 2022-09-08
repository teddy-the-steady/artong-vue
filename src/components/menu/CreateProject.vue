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
import { FACTORY_ABI, FACTORY, getSigner } from '../../contracts'

export default {
  name: 'CreateProject',
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
      console.log(this.name, this.symbol, this.maxAmount, this.policy)
      const signer = await getSigner()
      const contract = new ethers.Contract(FACTORY, FACTORY_ABI, signer)
      const tx = await contract.createNFTContract(
        this.name,
        this.symbol,
        this.maxAmount,
        this.policy
      )
      // TODO] mainnet에선 tx.wait가 매우 오래 걸릴 수 있음. foundation처럼 CollectionByContractAddress polling 하자
      const res = await tx.wait()
      console.log('res:',res)
      res.events.map(evt => {
        if (
          evt.topics[0] ===
          '0x2d49c67975aadd2d389580b368cfff5b49965b0bd5da33c144922ce01e7a4d7b'
        ) {
          const address = ethers.utils.hexDataSlice(evt.data, 44)
          console.log('nft address:', address)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
