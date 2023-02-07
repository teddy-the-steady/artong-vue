<template>
  <div class="container">
    <span class="float-label">
      <input
        id="royalty"
        type="number"
        inputmode="decimal"
        :class="{ filled: tokenRoyalty }"
        v-model="tokenRoyalty"
        @input="onInputTokenRoyalty"
      />
      <label for="royalty">Token royalty</label>
    </span>
    <div class="unit">%</div>
  </div>
</template>

<script>
export default {
  name: 'MintStep2',
  data() {
    return {
      tokenRoyalty: null,
    }
  },
  methods: {
    onInputTokenRoyalty() {
      if (this.tokenRoyalty > 50) {
        this.tokenRoyalty = '50'
      }
      this.tokenRoyalty = this.tokenRoyalty.match(/^\d+\.?\d{0,2}/)
      this.$emit('data-from-step3', 'tokenRoyalty', this.tokenRoyalty)
    },
  },
}
</script>
<style lang="scss" scoped>
@import '../../../assets/scss/variables';

.container {
  text-align: left;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  .unit {
    margin-left: 5px;
  }
}
</style>
