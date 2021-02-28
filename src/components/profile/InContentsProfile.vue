<template>
  <div class="profile">
    <img v-if="profileImage" :src="profileImage" alt="">
    <img v-else src="../../assets/images/profile.svg" alt="">
  </div>
</template>

<script>
export default {
  name: 'InContentsProfile',
  props: {
    profileImage: {
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
    width: 30px;
    height: 30px;
    border-radius: 50%;

    img {
        width: 30px;
        vertical-align: center;
    }
}
</style>
