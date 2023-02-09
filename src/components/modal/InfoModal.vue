<template>
  <div :class="top ? 'words words-top' : 'words words-bottom'" ref="words">
    {{ infoText }}
  </div>
</template>
<script>
import { mapState } from 'vuex'

export default {
  name: 'InfoModal',
  data() {
    return {
      top: true,
    }
  },
  computed: {
    ...mapState({
      modalTop: state => state.menu.modalTop,
      modalLeft: state => state.menu.modalLeft,
      infoText: state => state.menu.infoText,
      isInfoModalOpen: state => state.menu.isInfoModalOpen,
    }),
  },
  methods: {
    setModalTop(top) {
      //let words = document.querySelector('.words')
      // words.style.bottom = `${bottom}px`
      this.$refs.words.style.top = `${top}px`
    },
    setModalLeft(left) {
      // let words = document.querySelector('.words')
      // words.style.left = `${left}px`
      this.$refs.words.style.left = `${left}px`
    },
    getModalSize() {
      let modal = this.$refs.words
      let width = modal.getBoundingClientRect().width
      let height = modal.getBoundingClientRect().height
      console.log('modal width: ' + width)
      console.log('modal height: ' + height)
    },
  },
  watch: {
    modalTop(val) {
      this.setModalTop(val)
    },
    modalLeft(val) {
      this.setModalLeft(val)
    },
    isInfoModalOpen() {
      this.getModalSize()
    },
  },
}
</script>
<style lang="scss" scoped>
@import '../../assets/scss/variables';
.words {
  position: absolute;
  z-index: 100000;
  width: 400px;
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
