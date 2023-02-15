<template>
  <img
    class="icon"
    ref="icon"
    src="../../assets/icons/info.svg"
    @click="clicked"
  />
</template>

<script>
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
      const iconTop = window.pageYOffset + icon.getBoundingClientRect().top
      const iconLeft = window.pageXOffset + icon.getBoundingClientRect().left
      this.$store.commit('SET_ICON_POSITION', { iconTop, iconLeft })
    },
    setTip() {
      this.$store.commit('SET_TOOL_TIP', this.tip)
    },
  },
}
</script>
