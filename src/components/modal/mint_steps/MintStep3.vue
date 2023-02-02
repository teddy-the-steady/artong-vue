<template>
  <div class="container">
    <span class="title">Token royalty</span>
    <div class="main-text">
      <input
        type="text"
        v-model="tokenRoyalty"
        placeholder="token royalty"
        @input="onInputTokenRoyalty"
      />
      <div class="unit">%</div>
    </div>
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
      this.$emit('data-from-step3', 'tokenRoyalty', this.tokenRoyalty)
    },
  },
}
</script>
<style lang="scss" scoped>
@import '../../../assets/scss/variables';

.container {
  text-align: left;
  display: flex;
  .title {
    margin-bottom: 5px;
    line-height: 40px;
    display: block;
  }
  .main-text {
    display: flex;
    justify-content: center;
    margin-left: 23px;
    .unit {
      line-height: 40px;
      margin-left: 5px;
    }
  }
}
</style>
