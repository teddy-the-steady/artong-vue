<template>
  <div>
    <ul>
      <li class="like" :class="{active: isActive}" @click="onLikeClick()">
        <img src="../../assets/images/heart.png" alt="">
      </li>
      <li>
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

    &.like {
      filter: invert(1%) sepia(1%) saturate(1%) hue-rotate(1deg) brightness(1000%) contrast(80%);
    }

    &.active {
      filter: none;
    }
  }
}

</style>
