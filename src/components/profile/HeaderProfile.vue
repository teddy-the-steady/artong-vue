<template>
  <div class="profile">
    <router-link v-if="!signedIn" to="/login">
      <img src="../../assets/images/profile.svg" alt="">
    </router-link>
    <router-link v-else to="/user">
      <img src="../../assets/images/profile.svg" alt="">
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

    img {
        width: 30px;
        vertical-align: center;
        filter: brightness(1%) contrast(100%);
    }
}
</style>
