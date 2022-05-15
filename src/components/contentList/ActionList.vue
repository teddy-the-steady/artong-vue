<template>
  <div>
    <ul>
      <li class="like" @click="onLikeClick()">
        <img :class="{active: image.like}" src="../../assets/images/heart.png" alt="">
      </li>
      <li class="comment" @click="onCommentClick()">
        <img :class="{active: isCommentActive}" src="../../assets/images/comment.png" alt="">
      </li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios'
import { isAuthenticated } from '../../util/commonFunc'

export default {
  name: 'ActionList',
  props: {
    image: {
      type: Object,
      default: null
    },
    isPropCommentActive: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isCommentActive: this.isPropCommentActive
    }
  },
  methods: {
    async onLikeClick() {
      if (!isAuthenticated()) {
        alert('로그인이 필요합니다:)')
        return
      }

      if (this.image.like) {
        await axios.post(`/contents/${this.image.id_pk}/reactions`, {
          action_code: 'unlike'
        })
      } else {
        await axios.post(`/contents/${this.image.id_pk}/reactions`, {
          action_code: 'like'
        })
      }
      this.image.like = !this.image.like
    },
    onCommentClick() {
      this.isCommentActive = !this.isCommentActive
      this.$emit('handle-comment-click', this.isCommentActive)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/variables';

ul {
  display: flex;
  justify-content: space-around;
  margin: 0;
  padding: 0;
  li {
    list-style-type: none;
    cursor: pointer;
    img {
      width: 30px;
    }

    &.comment {
      z-index: 99;
      img {
        filter: invert(100%) sepia(1%) saturate(1%) hue-rotate(1deg) brightness(1000%) contrast(100%) drop-shadow(0px 1px 2px black);

        &.active {
          filter: invert(100%) sepia(1%) saturate(1%) hue-rotate(1deg) brightness(1000%) contrast(100%) drop-shadow(0px 0px 1px black);
        }
      }
    }

    &.like {
      z-index: 100;
      img {
        filter: invert(1%) sepia(1%) saturate(1%) hue-rotate(1deg) brightness(1000%) contrast(100%) drop-shadow(0px 1px 2px black);

        &.active {
          filter: none;
          animation: bounce-in .8s;
        }

        @keyframes bounce-in {
          0% {
            transform: scale(0);
          }
          70% {
            transform: scale(2.5);
          }
          80% {
            transform: rotate(5deg);
          }
          85% {
            transform: rotate(-15deg);
          }
          90% {
            transform: rotate(13deg);
          }
          95% {
            transform: rotate(-8deg);
          }
          100% {
            transform: scale(1) rotate(5deg);
          }
        }
      }
    }
  }
}
</style>
