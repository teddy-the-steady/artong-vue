<template>
  <div>
    <div>
      <span>Name</span>
      <input :model="name" placeholder="name">
    </div>
    <div>
      <span>Symbol</span>
      <input :model="symbol" placeholder="symbol">
    </div>
    <div>
      <span>Max amount</span>
      <input :model="maxAmount" placeholder="maxAmount">
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
      maxAmount: null
    }
  },
  methods: {
    async createProject() {
      const signer = await getSigner()
      const contract = new ethers.Contract(FACTORY, FACTORY_ABI, signer)
      const data = await contract.createNFTContract(
        this.name,
        this.symbol,
        this.maxAmount,
        1
      )
      console.log('data:',data)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
