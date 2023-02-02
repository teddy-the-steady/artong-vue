<template>
  <div>
    <div v-if="image" class="center">
      <!-- <img :src="image.url" alt=""/> -->
      <div class="image">
        <img v-if="isNaN(image.url)" :src="image.url" alt="" />
        <img
          v-else
          :src="require(`../../assets/images/art${image.url}.jpg`)"
          alt=""
        />
        <ContentLayer
          :image="image"
          class="content-layer"
          :isPropCommentActive="isCommentActive"
          @handle-comment-click="handleCommentClick"
        ></ContentLayer>
      </div>
    </div>
    <div class="comment" v-if="isCommentActive">
      <span class="spinner" :class="{ active: isSpinnerActive }"></span>
      <ul class="comment-list" :class="{ active: isCommentListActive }">
        <li>user1: 훌륭한 작품이네요!</li>
        <li>user2: 잘봤습니다.</li>
        <li>user3: Good work</li>
      </ul>
    </div>
  </div>
</template>

<script>
import ContentLayer from './ContentLayer.vue'

export default {
  name: 'CenterContainer',
  components: {
    ContentLayer,
  },
  props: {
    image: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      isCommentActive: false,
      isSpinnerActive: true,
      isCommentListActive: false,
    }
  },
  methods: {
    handleCommentClick(isActive) {
      this.isCommentActive = isActive
      setTimeout(() => {
        this.isSpinnerActive = !this.isCommentActive
        this.isCommentListActive = this.isCommentActive
      }, 1000)
    },
  },
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/variables';

.center {
  margin: 0.5rem;
  width: 50%;
  position: relative;

  .image {
    display: inline-grid;
    position: relative;

    img {
      width: 100%;
      height: auto;
      cursor: pointer;
      border-radius: 20px;
    }

    .content-layer {
      position: absolute;
      top: 0;
      width: 100%;
      height: 100%;
    }
  }
}

.comment {
  display: block;
  position: relative;
  width: 100%;
  min-height: 57px;
  box-shadow: 1px 1px 0.5em $lightgray;
  border-radius: 20px;

  .comment-list {
    display: none;

    &.active {
      display: block;
      text-align: left;
      margin: 0;
    }
  }
}

@media only screen and (max-width: 599px) {
  .center {
    width: 95%;
  }
}
</style>
