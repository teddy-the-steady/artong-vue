<template>
  <div class="container">
    <div>
      <span class="float-label">
        <input
          id="royalty"
          type="number"
          inputmode="decimal"
          :class="{ filled: tokenRoyalty }"
          v-model="tokenRoyalty"
          @input="onInputTokenRoyalty"
        />
        <label for="royalty">
          {{ $t('views.project.mint-modal.input.token-royalty') }}
        </label>
        <div class="unit">%</div>
      </span>
      <div class="caption">
        {{ $t('views.project.mint-modal.input.token-royalty-caption') }}
        <TooltipIcon
          :tip="$t('views.project.mint-modal.tooltip.token-royalty')"
        />
      </div>
    </div>
  </div>
</template>

<script>
import TooltipIcon from '../../util/ToolTipIcon.vue'
export default {
  name: 'MintStep2',
  components: { TooltipIcon },
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
  height: 120px;
  display: flex;
  justify-content: center;
  align-items: center;
  .float-label {
    align-items: center;
    .unit {
      margin-left: 5px;
    }
  }
  .caption {
    display: flex;
    align-items: center;
    margin-top: 10px;
  }
}
</style>
