<template>
  <div class="container">
    <div class="words" v-if="true">{{ words }}</div>
    <div class="empty-box" v-else></div>
    <img
      class="info-button"
      @click="toggleInfo"
      src="../../assets/icons/info.svg"
    />
    <p>Hover here<span>some text here?</span></p>
    <a href="#" class="info">Shailender Arora <span>TOOLTIP</span></a>
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
      this.calculateIconPosition()
      this.changePosition()
    },
    calculateIconPosition() {
      let icon = document.querySelector('.info-button')
      let iconTop = window.pageYOffset + icon.getBoundingClientRect().top
      let iconLeft = window.pageXOffset + icon.getBoundingClientRect().left
      console.log('top: ' + iconTop)
      console.log('left: ' + iconLeft)
    },
    changePosition() {
      let icon = document.querySelector('.info-button')
      let words = document.querySelector('.words')
      let wordsTop1 = window.pageYOffset + words.getBoundingClientRect().top
      let wordsLeft1 = window.pageXOffset + words.getBoundingClientRect().left
      console.log('words top1: ' + wordsTop1)
      console.log('words left1: ' + wordsLeft1)
      words.style.left = window.pageXOffset + icon.getBoundingClientRect().left
      words.style.top = window.pageYOffset + icon.getBoundingClientRect().top
      let wordsTop2 = window.pageYOffset + words.getBoundingClientRect().top
      let wordsLeft2 = window.pageXOffset + words.getBoundingClientRect().left
      console.log('words top2: ' + wordsTop2)
      console.log('words left2: ' + wordsLeft2)
    },
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
    position: relative;
    margin-bottom: 10px;
    max-width: 400px;
    min-height: 50px;
    background: #eeeeee;
    border-radius: 10px;
    padding: 10px;
    box-sizing: border-box;
  }
  .words::after {
    position: absolute;
    border-top: 0px solid pink;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-bottom: 0px solid transparent;
    content: '';
    top: 300px;
    left: 200px;
  }
}
span {
  background: none repeat scroll 0 0 #f8f8f8;
  border: 5px solid #dfdfdf;
  color: #717171;
  font-size: 13px;
  height: 30px;
  letter-spacing: 1px;
  line-height: 30px;
  margin: 0 auto;
  position: relative;
  text-align: center;
  text-transform: uppercase;
  top: -80px;
  left: -30px;
  display: none;
  padding: 0 20px;
}
span:after {
  content: '';
  position: absolute;
  bottom: -10px;
  width: 10px;
  height: 10px;
  border-bottom: 5px solid #dfdfdf;
  border-right: 5px solid #dfdfdf;
  background: #f8f8f8;
  left: 50%;
  margin-left: -5px;
  -moz-transform: rotate(45deg);
  -webkit-transform: rotate(45deg);
  transform: rotate(45deg);
}
p {
  margin: 100px;
  float: left;
  position: relative;
  cursor: pointer;
}

p:hover span {
  display: block;
}
a.info {
  position: relative; /*this is the key*/
  color: #000;
  top: 100px;
  left: 50px;
  text-decoration: none;
  text-align: center;
}

a.info span {
  display: none;
}

a.info:hover span {
  /*the span will display just on :hover state*/
  display: block;
  position: absolute;
  top: -60px;
  width: 15em;
  border: 5px solid #0cf;
  background-color: #cff;
  color: #000;
  text-align: center;
  padding: 10px;
}

a.info:hover span:after {
  /*the span will display just on :hover state*/
  content: '';
  position: absolute;
  bottom: -11px;
  width: 10px;
  height: 10px;
  border-bottom: 5px solid #0cf;
  border-right: 5px solid #0cf;
  background: #cff;
  left: 50%;
  margin-left: -5px;
  -moz-transform: rotate(45deg);
  -webkit-transform: rotate(45deg);
  transform: rotate(45deg);
}
</style>
