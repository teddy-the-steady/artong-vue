<template>
  <div class="container">
    <div class="when">
      <span>WHEN?</span>
      <input
        class="mint-now-radio"
        type="radio"
        id="r1"
        v-model="lazyMint"
        value="0"
        :disabled="project.policy === 1"
        @change="onLazyMintChange"
      />
      <label for="r1">Mint Now</label>
      <input
        class="lazy-mint-radio"
        type="radio"
        id="r2"
        v-model="lazyMint"
        value="1"
        :disabled="project.policy === 1"
        @change="onLazyMintChange"
      />
      <label for="r2">Lazy Mint</label>
    </div>

    <div v-show="lazyMint == 1" class="price-input">
      <span>Price</span>
      <input
        type="number"
        inputmode="decimal"
        v-model="price"
        placeholder="Price in ETH"
        @input="onInputPrice"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'MintStep3',
  props: {
    project: {
      type: Object,
      default: () => {},
    },
    slotData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      lazyMint: this.slotData.slotData.lazyMint,
      price: null,
    }
  },
  methods: {
    onLazyMintChange() {
      this.$emit('data-from-step2', 'lazyMint', this.lazyMint)
    },
    onInputPrice() {
      this.$emit('data-from-step2', 'price', this.price)
    },
  },
}
</script>
<style lang="scss" scoped>
@import '../../../assets/scss/variables';
.container {
  text-align: left;
  .when {
    margin-bottom: 20px;
    .mint-now-radio {
      margin-left: 69px;
    }
    .lazy-mint-radio {
      margin-left: 30px;
    }
  }
  .price-input {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
