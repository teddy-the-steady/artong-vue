<template>
  <div>
    <span>WHEN?</span>
    <input
      type="radio"
      id="r1"
      v-model="lazyMint"
      value="0"
      :disabled="project.policy === 1"
      @change="onLazyMintChange"
    />
    <label for="r1">Mint Now</label>
    <input
      type="radio"
      id="r2"
      v-model="lazyMint"
      value="1"
      :disabled="project.policy === 1"
      @change="onLazyMintChange"
    />
    <label for="r2">Lazy Mint</label>
    <div v-show="lazyMint == 1">
      <span>Price</span>
      <input
        type="text"
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
