<template>
  <div class="profile">
    <router-link v-if="!signedIn" to="/login">
      <img src="../../assets/images/profilethumb.png" alt="">
    </router-link>
    <router-link v-else to="/user">
      <img src="../../assets/images/profilethumb.png" alt="">
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'HeaderProfile',
  computed: {
    signedIn() {
      return this.$store.state.signedIn
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
    border: 2px solid $artong-main;
    border-radius: 50%;

    img {
        width: 30px;
        vertical-align: center;
    }
}
</style>
