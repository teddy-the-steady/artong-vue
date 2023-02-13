<template>
  <div>
    <button
      class="dropdown ripple"
      @mousedown="localeMouseDown"
      @mouseup="localeMouseUp"
      @touchstart="localeTouchStart"
      @touchend="localeTouchEnd"
    >
      <div>{{ localeSelected.text }}</div>
      <img
        :class="{ active: isDialogActive }"
        src="../../assets/icons/arrow_down.svg"
      />
    </button>
    <BasicDialog
      class="dialog"
      :class="{ active: isDialogActive }"
      @dialog-focus-out="closeDialog"
      ref="dialog"
    >
      <div
        slot="body"
        v-for="(option, name) in localeOptions"
        :key="name"
        @click="localeClick(option)"
      >
        {{ option.text }}
      </div>
    </BasicDialog>
  </div>
</template>

<script>
import BasicDialog from '../dialog/BasicDialog.vue'

export default {
  name: 'LocaleDropdown',
  components: { BasicDialog },
  props: {
    localeOptions: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    isMobile() {
      return this.$isMobile()
    },
  },
  data() {
    return {
      localeSelected: { name: 'ko', text: '한국' },
      isDialogActive: false,
      isMouseDownLocale: false,
      isMouseUpLocale: false,
    }
  },
  methods: {
    closeDialog() {
      this.isDialogActive = false
      this.isMouseDownLocale = false
      this.isMouseUpLocale = false
    },
    localeMouseDown() {
      if (!this.isMobile) {
        this.isMouseDownLocale = true
      }
    },
    localeMouseUp() {
      if (!this.isMobile) {
        this.isMouseUpLocale = true
        if (this.isMouseDownLocale) {
          this.isDialogActive = true
        }
      }
    },
    localeTouchStart() {
      if (this.isMobile) {
        this.isMouseDownLocale = true
      }
    },
    localeTouchEnd() {
      if (this.isMobile) {
        this.isMouseUpLocale = true
        if (this.isDialogActive) {
          this.isDialogActive = false
          return
        }
        if (this.isMouseDownLocale) {
          this.isDialogActive = true
        }
      }
    },
    localeClick(option) {
      if (this.localeSelected.name.toLowerCase() === option) {
        return
      }
      this.localeSelected = option
    },
  },
  watch: {
    isDialogActive() {
      if (!this.isMobile) {
        this.$nextTick(() => this.$refs.dialog.$el.focus())
      }
    },
  },
}
</script>

<style lang="scss" scoped>
img {
  &.active {
    transition: 0.1s transform ease;
    transform: rotate(180deg);
  }
  width: 9.5px;
}
.dialog {
  display: none;
  &.active {
    display: block;
    z-index: 1;
    transform: translateY(16px);
  }
}
</style>
