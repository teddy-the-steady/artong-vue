<template>
  <div :class="enoughTopSpace ? 'tip tip-top' : 'tip tip-bottom'" ref="tip">
    {{ toolTip }}
  </div>
</template>
<script>
import { mapState } from 'vuex'

export default {
  name: 'ToolTipModal',
  data() {
    return {
      enoughTopSpace: true,
      width: 0,
      height: 0,
    }
  },
  computed: {
    ...mapState({
      iconTop: state => state.menu.iconTop,
      iconLeft: state => state.menu.iconLeft,
      toolTip: state => state.menu.toolTip,
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
      console.log(top)
      if (top < 150) {
        top = this.iconTop + 40
        this.enoughTopSpace = false
      }
      this.$refs.tip.style.top = `${top}px`
    },
    setModalLeft() {
      const left = this.iconLeft - 10
      this.$refs.tip.style.left = `${left}px`
    },
  },
  watch: {
    toolTip() {
      this.$refs.tip.style.top = 'auto'
      this.$refs.tip.style.left = 'auto'
      this.enoughTopSpace = true
      this.setModalSize()
    },
  },
}
</script>
<style lang="scss" scoped>
@import '../../assets/scss/variables';
.tip {
  position: absolute;
  z-index: 998;
  max-width: 60%;
  height: auto;
  background: #eeeeee;
  border-radius: 10px;
  padding: 0.75rem 1.25rem;
  box-sizing: border-box;
  box-shadow: 2px 2px 12px rgb(0 0 0 / 14%);
}
.tip-top:after {
  border-top: 10px solid #eeeeee;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 0px solid transparent;
  content: '';
  position: absolute;
  bottom: -10px;
  left: 12px;
}
.tip-bottom:before {
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
