<template>
  <div class="wrapper">
    <div class="top">
      <div>username</div>
      <ProfileImageBig></ProfileImageBig>
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
