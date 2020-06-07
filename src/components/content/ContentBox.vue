<template>
  <div class="box" @click="imageSelect()" ref="box">
    <!-- <span>{{image.index}}</span> -->
    <img :src="require(`../../assets/images/gogh${image.url}.jpg`)" alt=""/>
  </div>
</template>

<script>
export default {
  name: 'ContentBox',
  props: {
    image: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      box: ''
    }
  },
  methods: {
    imageSelect () {
      console.log(this.$refs.box.getBoundingClientRect().top + ',' + this.$refs.box.getBoundingClientRect().left)
      this.$emit('image-selected', this.image.index)
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
  width: 100%;
  height: auto;
  cursor: pointer;
}
</style>
