<template>
  <div class="container">
    This is a test
    <img class="icon" @click="toggleModal" src="../../assets/icons/info.svg" />
    <InfoModal
      v-show="opened"
      :words="words"
      :modalTop="modalTop"
      :modalLeft="modalLeft"
    ></InfoModal>
  </div>
</template>
<script>
import InfoModal from '../modal/InfoModal.vue'
export default {
  name: 'Test',
  components: {
    InfoModal,
  },
  data() {
    return {
      words: 'hi this is captain speaking',
      opened: false,
      modalTop: null,
      modalLeft: null,
    }
  },
  methods: {
    toggleModal() {
      this.opened = !this.opened
      if (!this.opened) {
        this.calculateModalPosition()
      }
    },
    calculateModalPosition() {
      let icon = document.querySelector('.icon')
      let iconTop = window.pageYOffset + icon.getBoundingClientRect().top
      let iconLeft = window.pageXOffset + icon.getBoundingClientRect().left
      this.modalTop = iconTop - 60
      this.modalLeft = iconLeft - 10
      console.log('mdoal top on parent ' + this.modalTop)
      console.log('modal left on parent ' + this.modalLeft)
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
  .info {
  }
}
</style>
