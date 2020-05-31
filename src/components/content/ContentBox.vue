<template>
  <div class="box">
    <img :src="require(`../../assets/images/gogh${imageNum}.jpg`)" alt=""/>
  </div>
</template>

<script>
export default {
  name: 'ContentBox',
  data () {
    return {
      imageNum: this.getRandomIntInclusive(1, 4)
    }
  },
  methods: {
    getRandomIntInclusive (min, max) {
      min = Math.ceil(min)
      max = Math.floor(max)
      const result = Math.floor(Math.random() * (max - min + 1)) + min
      return result
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/variables';

.box {
 display: flex;
 align-items: flex-start;
}

img {
  max-width: 100%;
  height: auto;
}
</style>
