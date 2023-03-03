<template>
  <div class="tip" ref="tip" @focusout="handleFocusOut" tabindex="0">
    {{ toolTip }}
  </div>
</template>
<script>
import { mapState } from 'vuex'

export default {
  name: 'ToolTipModal',
  data() {
    return {
      width: 0,
      height: 0,
    }
  },
  computed: {
    ...mapState({
      iconTop: state => state.menu.iconTop,
      iconLeft: state => state.menu.iconLeft,
      toolTip: state => state.menu.toolTip,
      innerWidth: state => state.menu.innerWidth,
      isToolTipOpen: state => state.menu.isToolTipOpen,
    }),
  },
  methods: {
    setModalSize() {
      this.$nextTick(() => {
        this.width = this.$refs.tip.clientWidth
        this.height = this.$refs.tip.clientHeight

        this.setModalTop()
        this.setModalLeft()
      })
    },
    setModalTop() {
      let top = this.iconTop - this.height - 10
      if (top < 150) {
        top = this.iconTop + 40
        this.positionUpper = false
      }
      this.$refs.tip.style.top = `${top}px`
    },
    setModalLeft() {
      let left = 0
      const ratio = this.iconLeft / this.innerWidth
      if (ratio >= 0.6) {
        left = this.iconLeft - this.width + 40
      } else if (ratio < 0.3) {
        left = this.iconLeft - 10
      } else {
        left = this.iconLeft - this.width / 2 + 10
      }
      this.$refs.tip.style.left = `${left}px`
    },
    handleFocusOut() {
      this.$store.commit('CLOSE_TOOL_TIP')
    },
  },
  watch: {
    toolTip() {
      this.$refs.tip.style.top = 'auto'
      this.$refs.tip.style.left = 'auto'
      this.setModalSize()
    },
    isToolTipOpen(val) {
      if (val) {
        this.$refs.tip.focus({ preventScroll: true })
      }
    },
  },
}
</script>
<style lang="scss" scoped>
@import '../../assets/scss/variables';
.tip {
  position: absolute;
  z-index: 998;
  max-width: 50%;
  height: auto;
  background: #eeeeee;
  border-radius: 10px;
  padding: 0.75rem 1.25rem;
  box-sizing: border-box;
  box-shadow: 2px 2px 12px rgb(0 0 0 / 14%);
  white-space: pre-line;
  text-align: left;

  &:focus {
    outline: 0;
  }
}
</style>
