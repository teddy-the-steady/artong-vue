<template>
  <div
    :class="enoughTop ? 'words words-top' : 'words words-bottom'"
    ref="words"
  >
    {{ tip }}
  </div>
</template>
<script>
import { mapState } from 'vuex'

export default {
  name: 'ToolTipModal',
  data() {
    return {
      enoughTop: true,
      width: 0,
      height: 0,
      tip: null,
    }
  },
  computed: {
    ...mapState({
      iconTop: state => state.menu.iconTop,
      iconLeft: state => state.menu.iconLeft,
      toolTip: state => state.menu.toolTip,
      isToolTipOpen: state => state.menu.isToolTipOpen,
    }),
  },
  methods: {
    setModalTop(iconTop) {
      console.log(iconTop)
      console.log(this.height)
      const top = iconTop - 50
      this.$refs.words.style.top = `${top}px`
    },
    setModalLeft(iconLeft) {
      console.log(this.width)
      const left = iconLeft - 10
      this.$refs.words.style.left = `${left}px`
    },
    setModalSize() {
      const modal = this.$refs.words
      this.width = modal.getBoundingClientRect().width
      this.height = modal.getBoundingClientRect().height
    },
    checkSpaceTop() {
      this.modalTop
    },
    observeSize() {
      const resizeObserver = new ResizeObserver(entries => {
        entries.forEach(entry => {
          const { width, height } = entry.contentRect
          this.width = width
          this.height = height
        })
      })
      resizeObserver.observe(this.$refs.words)
    },
  },
  watch: {
    iconTop(val) {
      this.setModalTop(val)
    },
    iconLeft(val) {
      this.setModalLeft(val)
    },
    toolTip(val) {
      this.tip = val
      this.observeSize()
      this.setModalSize()
    },
  },
}
</script>
<style lang="scss" scoped>
@import '../../assets/scss/variables';
.words {
  position: absolute;
  z-index: 100000;
  max-width: 400px;
  height: auto;
  background: #eeeeee;
  border-radius: 10px;
  padding: 0.75rem 1.25rem;
  box-sizing: border-box;
  box-shadow: 2px 2px 12px rgb(0 0 0 / 14%);
}
.words-top:after {
  border-top: 10px solid #eeeeee;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 0px solid transparent;
  content: '';
  position: absolute;
  bottom: -10px;
  left: 12px;
}
.words-bottom:before {
  border-top: 0px solid transparent;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 10px solid #eeeeee;
  content: '';
  position: absolute;
  top: -10px;
  left: 12px;
}
</style>
