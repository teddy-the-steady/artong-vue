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
    <button>CREATE PROJECT</button>
  </div>
</template>

<script>
export default {
  name: 'CreateProject',
  data() {
    return {
      name: '',
      symbol: '',
      maxAmount: null
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
