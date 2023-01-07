<template>
  <div class="box">
    <img
      :src="
        image.content_thumbnail_s3key ||
        image.content_s3key ||
        this.image.contentURI.replace('ipfs://', 'https://ipfs.io/ipfs/')
      "
      @error="replaceImage"
    />
  </div>
</template>

<script>
export default {
  name: 'ContentBox',
  props: {
    image: {
      type: Object,
      default: null,
    },
  },
  methods: {
    replaceImage(e) {
      const imageUrl = e.target.currentSrc
      if (imageUrl.indexOf('resized-') > -1) {
        e.target.src = this.image.content_s3key
      } else {
        e.target.src = this.image.contentURI.replace(
          'ipfs://',
          'https://ipfs.io/ipfs/',
        )
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/variables';

.box {
  display: flex;
  align-items: flex-start;
  overflow: hidden;
  border-radius: 20px;
  max-height: 300px;
  box-shadow: 1px 1px 4px 0 rgb(0 0 0 / 15%);
  margin: 0 10px;
  &:hover {
    box-shadow: 1px 1px 0.5em $darkgray, -1px -1px 0.5em $darkgray;
  }

  img {
    width: 100%;
    height: auto;
    cursor: pointer;
  }
}
</style>
