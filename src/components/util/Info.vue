<template>
  <div class="container">
    <div class="words" v-if="infoOpened">{{ words }}</div>
    <div class="empty-box" v-else></div>
    <img
      class="info-button"
      @click="toggleInfo"
      src="../../assets/icons/info.svg"
    />
  </div>
</template>
<script>
export default {
  name: 'Info',
  data() {
    return {
      infoOpened: false,
    }
  },
  props: {
    words: {
      type: String,
      default: null,
    },
  },
  methods: {
    toggleInfo() {
      this.infoOpened = !this.infoOpened
      //   this.calculateIconPosition()
      //   this.changePosition()
    },
    // calculateIconPosition() {
    //   let icon = document.querySelector('.info-button')
    //   let iconTop = window.pageYOffset + icon.getBoundingClientRect().top
    //   let iconLeft = window.pageXOffset + icon.getBoundingClientRect().left
    //   console.log('top: ' + iconTop)
    //   console.log('left: ' + iconLeft)
    // },
    // changePosition() {
    //   let icon = document.querySelector('.info-button')
    //   let words = document.querySelector('.words')
    //   let wordsTop1 = window.pageYOffset + words.getBoundingClientRect().top
    //   let wordsLeft1 = window.pageXOffset + words.getBoundingClientRect().left
    //   console.log('words top1: ' + wordsTop1)
    //   console.log('words left1: ' + wordsLeft1)
    //   words.style.left = window.pageXOffset + icon.getBoundingClientRect().left
    //   words.style.top = window.pageYOffset + icon.getBoundingClientRect().top
    //   let wordsTop2 = window.pageYOffset + words.getBoundingClientRect().top
    //   let wordsLeft2 = window.pageXOffset + words.getBoundingClientRect().left
    //   console.log('words top2: ' + wordsTop2)
    //   console.log('words left2: ' + wordsLeft2)
    // },
  },
}
</script>
<style lang="scss" scoped>
@import '../../assets/scss/variables';

.container {
  .info-button {
    width: 19px;
    display: block;
  }
  .empty-box {
    width: 400px;
    height: 60px;
  }
  .words {
    position: static;
    margin-bottom: 10px;
    max-width: 400px;
    min-height: 50px;
    background: #eeeeee;
    border-radius: 10px;
    padding: 10px;
    box-sizing: border-box;
  }
}
</style>
