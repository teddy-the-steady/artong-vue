<template>
  <div class="container">
    <div class="when">
      <span>{{ $t('views.project.mint-modal.input.mint') }}</span>
      <input
        class="mint-now-radio"
        type="radio"
        id="r1"
        v-model="lazyMint"
        value="0"
        :disabled="project.policy === 1"
        @change="onLazyMintChange"
      />
      <label for="r1">{{ $t('views.project.mint-modal.input.now') }}</label>
      <input
        class="lazy-mint-radio"
        type="radio"
        id="r2"
        v-model="lazyMint"
        value="1"
        :disabled="project.policy === 1"
        @change="onLazyMintChange"
      />
      <label for="r2">
        {{ $t('views.project.mint-modal.input.on-sold') }}
      </label>
      <TooltipIcon
        class="tooltip-icon"
        :tip="$t('views.project.mint-modal.tooltip.lazy-mint')"
      />
    </div>

    <div v-show="lazyMint == 1" class="price-input">
      <span>{{ $t('views.project.mint-modal.input.price.label') }}</span>
      <input
        type="number"
        inputmode="decimal"
        v-model="price"
        :placeholder="$t('views.project.mint-modal.input.price.placeholder')"
        @input="onInputPrice"
      />
    </div>
  </div>
</template>

<script>
import TooltipIcon from '../../util/ToolTipIcon.vue'

export default {
  name: 'MintStep3',
  components: { TooltipIcon },
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
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    .mint-now-radio {
      margin-left: auto;
    }
    .lazy-mint-radio {
      margin-left: 30px;
    }
    .tooltip-icon {
      width: 20px;
    }
  }
  .price-input {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
