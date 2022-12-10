<template>
  <div class="wrapper">
    <div class="top">
      <div>username</div>
      <div class="profileImg">
        <ProfileImageBig></ProfileImageBig>
      </div>
    </div>
    <div class="bottom">
      <div>?? Collections</div>
    </div>
  </div>
</template>

<script>
import ProfileImageBig from './ProfileImageBig.vue'
export default {
  name: 'ProfileCard',
  components: { ProfileImageBig },
}
</script>
<style lang="scss" scoped>
@import '../../assets/scss/variables';

// .profileImg {
//   height: 120px;
//   width: 120px;
// }
</style>
