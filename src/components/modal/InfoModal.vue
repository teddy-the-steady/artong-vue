<template>
  <div
    :class="enoughTop ? 'words words-top' : 'words words-bottom'"
    ref="words"
  >
    {{ text }}
  </div>
</template>
<script>
import { mapState } from 'vuex'

export default {
  name: 'InfoModal',
  data() {
    return {
      enoughTop: true,
      width: 0,
      height: 0,
      text: null,
    }
  },
  computed: {
    ...mapState({
      iconTop: state => state.menu.iconTop,
      iconLeft: state => state.menu.iconLeft,
      infoText: state => state.menu.infoText,
      isInfoModalOpen: state => state.menu.isInfoModalOpen,
    }),
  },
  methods: {
    setModalTop(iconTop) {
      // this.setModalSize()
      let top = iconTop - this.height - 2
      this.$refs.words.style.top = `${top}px`
    },
    setModalLeft(iconLeft) {
      // this.setModalSize()
      let left = iconLeft - this.width / 2 + 12
      this.$refs.words.style.left = `${left}px`
    },
    getModalSize() {
      console.log('modal width: ' + this.infoModalWidth)
      console.log('modal height: ' + this.infoModalHeight)
    },
    setModalSize() {
      let modal = this.$refs.words
      this.width = modal.getBoundingClientRect().width
      this.height = modal.getBoundingClientRect().height
      console.log('height: ' + this.height)
    },
    checkSpaceTop() {
      this.modalTop
    },
    observeSize() {
      const ro = new ResizeObserver(entries => {
        entries.forEach(entry => {
          const { width, height } = entry.contentRect
          this.width = width
          this.height = height
        })
      })
      ro.observe(this.$refs.words)
      console.log(this.width)
      console.log(this.height)
    },
  },
  watch: {
    iconTop(val) {
      this.setModalTop(val)
    },
    iconLeft(val) {
      this.setModalLeft(val)
    },
    infoText(val) {
      this.text = val
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
