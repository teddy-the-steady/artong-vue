<template>
  <div class="profile">
    <img v-if="profileImageUrl" :src="profileImageUrl" alt="">
    <img v-else src="../../assets/images/profile.svg" alt="">
  </div>
</template>

<script>
export default {
  name: 'InContentsProfile',
  props: {
    profileImageUrl: {
      type: String,
      default: null
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/variables';

.profile {
    background-color: $artong-white;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    cursor: pointer;

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 50%;
    }
}
</style>
