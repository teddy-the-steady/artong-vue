<template>
  <div class="profile">
    <div class="image">
      <img v-if="profileImage" :src="profileImage" alt="">
      <img v-else src="../../assets/images/profilethumb.png" alt="">
    </div>
    <div class="info">
      <div class="nick-name">
        nickname
      </div>
      <div class="intro">
        I draw hope
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserPageProfile',
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
    display: flex;
    width: 70%;

    .image {
        background-color: $artong-white;
        width: 100%;
        max-width: 150px;
        min-width: 100px;

        img {
            width: 90%;
            vertical-align: center;
            border: 5px solid $artong-main;
            border-radius: 50%;
        }
    }

    .info {
      display: flex;
      flex-direction: column;

      .nick-name {
        font-size: 30px;
      }
    }
}
</style>
