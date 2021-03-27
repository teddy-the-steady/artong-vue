<template>
  <div class="profile">
      <img src="../../assets/images/profile.svg" alt="">
  </div>
</template>

<script>
export default {
  name: 'HeaderProfile',
  created() {
    console.log('HeaderProfile created')
  },
  mounted() {
    console.log('HeaderProfile mounted')
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
    }
}
</style>
