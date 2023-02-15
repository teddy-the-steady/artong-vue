<template>
  <img
    class="icon"
    ref="icon"
    src="../../assets/icons/info.svg"
    @click="clicked"
  />
</template>

<script>
import DomHandler from '../../util/DomHandler'

export default {
  name: 'ToolTipIcon',
  props: {
    tip: {
      type: String,
      default: '',
    },
  },
  methods: {
    clicked() {
      this.setTip()
      this.setPosition()
      this.toggelToolTip()
    },
    toggelToolTip() {
      this.$store.commit('TOGGLE_TOOL_TIP')
    },
    setPosition() {
      const icon = this.$refs.icon
      const offset = DomHandler.getOffset(icon)
      this.$store.commit('SET_ICON_POSITION', {
        iconTop: offset.top,
        iconLeft: offset.left,
      })
    },
    setTip() {
      this.$store.commit('SET_TOOL_TIP', this.tip)
    },
  },
}
</script>

<style lang="scss" scoped>
.icon {
  margin-left: 3px;
  cursor: pointer;
}
</style>
