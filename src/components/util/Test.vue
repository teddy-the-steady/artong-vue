<template>
  <div class="container">
    This is a test
    <img
      class="icon"
      ref="icon"
      @click="clicked"
      src="../../assets/icons/info.svg"
    />
    <div>----------</div>
  </div>
</template>
<script>
import { mapState } from 'vuex'

export default {
  name: 'Test',
  components: {},
  data() {
    return {
      words:
        'It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
    }
  },
  computed: {
    ...mapState({
      isInfoModalOpen: state => state.menu.isInfoModalOpen,
      modalTop: state => state.menu.modalTop,
      modalLeft: state => state.menu.modalLeft,
      infoText: state => state.menu.infoText,
    }),
  },
  methods: {
    clicked() {
      this.setInfoText()
      this.setInfoModalPosition()
      this.toggelInfoModal()
    },
    toggelInfoModal() {
      this.$store.commit('TOGGLE_INFO_MODAL')
    },
    setInfoModalPosition() {
      let icon = this.$refs.icon
      let iconTop = window.pageYOffset + icon.getBoundingClientRect().top
      let iconLeft = window.pageXOffset + icon.getBoundingClientRect().left
      this.$store.commit('SET_INFO_MODAL_POSITION', { iconTop, iconLeft })
    },
    setInfoText() {
      this.$store.commit('SET_INFO_TEXT', this.words)
    },
  },
}
</script>
<style lang="scss" scoped>
@import '../../assets/scss/variables';

.container {
  //padding-top: 70px;
  margin-left: auto;
  margin-right: auto;
}
</style>
