<template>
  <div>
    <span>Token royalty</span>
    <input
      type="text"
      v-model="tokenRoyalty"
      placeholder="token royalty 1% = 100"
      @input="onInputTokenRoyalty"
    />
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
