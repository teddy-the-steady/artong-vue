<template>
  <div class="wrapper">
    <div class="top">
      <div class="name">@{{ profile.username }}</div>
      <div class="profileImg">
        <ProfileImageBig
          :profileImageUrl="profileImageUrl"
          :isFirstLoading="profileImageUrl ? false : true"
        ></ProfileImageBig>
      </div>
    </div>
    <div class="bottom">
      <div>{{ profile.contributions }} Contributions</div>
    </div>
  </div>
</template>

<script>
import ProfileImageBig from './ProfileImageBig.vue'

export default {
  name: 'ProfileCard',
  components: { ProfileImageBig },
  props: {
    profile: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    profileImageUrl() {
      return this.profile.profile_thumbnail_s3key || this.profile.profile_s3key
    },
  },
}
</script>
<style lang="scss" scoped>
@import '../../assets/scss/variables';
.wrapper {
  width: 90%;
  margin: auto;
  margin-top: 20px;
  border-radius: 20px;
  padding: 20px 0;
  box-shadow: 2px 2px 12px rgb(0 0 0 / 14%);
  .top {
    display: flex;
    flex-direction: column;
    align-items: center;
    .name {
      width: 80px;
      overflow: hidden !important;
      text-overflow: ellipsis;
    }
  }
}
</style>
