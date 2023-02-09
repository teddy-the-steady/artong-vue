<template>
  <div class="words">{{ words }}</div>
</template>
<script>
export default {
  name: 'InfoModal',
  props: {
    words: {
      type: String,
      default: null,
    },
    modalTop: {
      type: Number,
      default: null,
    },
    modalLeft: {
      type: Number,
      default: null,
    },
  },
  methods: {
    setModalPosition() {
      let words = document.querySelector('.words')
      words.style.top = `${this.modalTop}px`
      words.style.left = `${this.modalLeft}px`
    },
    setModalPositionTop(val) {
      let words = document.querySelector('.words')
      words.style.top = `${val}px`
    },
    setModalPositionLeft(val) {
      let words = document.querySelector('.words')
      words.style.left = `${val}px`
    },
    printModalPosition() {
      let words = document.querySelector('.words')
      let modalTop = window.pageYOffset + words.getBoundingClientRect().top
      let modalLeft = window.pageXOffset + words.getBoundingClientRect().left
      console.log('modal top on child ' + modalTop)
      console.log('modal left on child ' + modalLeft)
    },
  },
  watch: {
    modalTop(val) {
      this.printModalPosition()
      this.setModalPositionTop(val)
    },
    modalLeft(val) {
      this.setModalPositionLeft(val)
      this.printModalPosition()
    },
  },
  mounted() {
    console.log(this.modalTop)
    console.log(this.modalLeft)
    this.setModalPositionTop(this.modalTop)
    this.setModalPositionLeft(this.modalLeft)
  },
}
</script>
<style lang="scss" scoped>
@import '../../assets/scss/variables';
.words {
  position: absolute;
  z-index: 100000;
  width: 400px;
  height: 50px;
  background: pink;
  border-radius: 10px;
}
.words:after {
  border-top: 10px solid pink;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 0px solid transparent;
  content: '';
  position: absolute;
  top: 50px;
  left: 12px;
}
</style>
