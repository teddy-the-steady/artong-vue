<template>
  <div>
    <ul>
      <li class="like" @click="onLikeClick()">
        <img :class="{active: isActive}" src="../../assets/images/heart.png" alt="">
      </li>
      <li class="comment">
        <img src="../../assets/images/comment.png" alt="">
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'ActionList',
  data() {
    return {
      isActive: false
    }
  },
  methods: {
    onLikeClick() {
      this.isActive = !this.isActive
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
        filter: invert(100%) sepia(1%) saturate(1%) hue-rotate(1deg) brightness(1000%) contrast(100%) drop-shadow(0px 1px 2px grey);
      }
    }

    &.like {
      z-index: 100;
      img {
        filter: invert(1%) sepia(1%) saturate(1%) hue-rotate(1deg) brightness(1000%) contrast(100%) drop-shadow(0px 1px 2px grey);

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
