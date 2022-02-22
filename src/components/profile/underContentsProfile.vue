<template>
  <div class="profile">
    <img v-if="image" :src="image.profileUrl" alt="">
    <img v-else src="../../assets/images/profile.svg" alt="">
    <a class="username">{{image.username}}</a>
  </div>
</template>

<script>
export default {
  name: 'InContentsProfile',
  props: {
    image: {
      type: Object,
      default: null
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/variables';

.profile {
    display: flex;
    width: 30px;
    height: 30px;
    cursor: pointer;

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 50%;
    }

    .username {
      margin: 5px;
    }
}
</style>
