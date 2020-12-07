<template>
  <div>
    <div v-if="image" class="center">
      <!-- <img :src="image.url" alt=""/> -->
      <div class="image">
        <img :src="require(`../../assets/images/art${image.url}.jpg`)" alt=""/>
        <content-layer :image="image" class="content-layer" :isPropCommentActive="isCommentActive" @handle-comment-click="handleCommentClick"></content-layer>
      </div>
      <div class="comment" v-if="isCommentActive">
        <div class="spinner" :class="{active: isSpinnerActive}"></div>
        <ul class="comment-list" :class="{active: isCommentListActive}">
          <li>user1: 훌륭한 작품이네요!</li>
          <li>user2: 잘봤습니다.</li>
          <li>user3: Good work</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import ContentLayer from './ContentLayer'

export default {
  name: 'CenterContainer',
  components: {
    ContentLayer
  },
  props: {
    image: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      isCommentActive: false,
      isSpinnerActive: true,
      isCommentListActive: false
    }
  },
  methods: {
    handleCommentClick(isActive) {
      this.isCommentActive = isActive
      setTimeout(() => {
        this.isSpinnerActive = !this.isCommentActive
        this.isCommentListActive = this.isCommentActive
      }, 1000)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/variables';

.center {
  display: inline-grid;
  margin: 0.5rem;
  width: 200%;
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

  .comment {
    display: block;
    position: relative;
    width: 100%;
    min-height: 57px;
    background: $artong-white;
    box-shadow: 1px 1px .5em $lightgray;
    border-radius: 20px;

    .comment-list {
      display: none;

      &.active {
        display: block;
        text-align: left;
      }
    }

    .spinner {
      display: none;

      &.active {
        display: block;
        position: relative;
        top: 9px;
        height: 30px;
        width: 30px;
        margin: 0px auto;
        animation: rotation .6s infinite linear;
        border-left: 6px solid rgba(0,174,239,.15);
        border-right: 6px solid rgba(0,174,239,.15);
        border-bottom: 6px solid rgba(0,174,239,.15);
        border-top: 6px solid rgba(0,174,239,.8);
        border-radius: 100%;
      }
    }

    @keyframes rotation {
      from {transform: rotate(0deg);}
      to {transform: rotate(359deg);}
    }
  }
}
</style>
