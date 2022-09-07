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
      maxAmount: 0
    }
  },
  methods: {
    async createProject() {
      console.log(this.name, this.symbol, this.maxAmount)
      const signer = await getSigner()
      const contract = new ethers.Contract(FACTORY, FACTORY_ABI, signer)
      const tx = await contract.createNFTContract(
        this.name,
        this.symbol,
        this.maxAmount,
        1
      )
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
