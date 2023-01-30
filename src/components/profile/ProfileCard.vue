<template>
  <div class="wrapper">
    <div class="top">
      <div class="name">@{{ profile.username }}</div>
      <div class="profileImg">
        <ProfileImageBig
          :profileImageUrl="processImageUrl(profileImageUrl)"
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
import { makeS3Path } from '../../util/commonFunc'

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
  methods: {
    makeS3Path() {
      return makeS3Path
    },
    processImageUrl(url) {
      return makeS3Path(url)
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
      font-family: 'Pretendard';
      font-style: normal;
      font-weight: 500;
      font-size: 14px;
      color: #ffffff;
      margin-bottom: 12px;
      margin-top: 24px;
    }
  }
  .bottom {
    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    color: #808080;
    margin-top: 12px;
  }
}
</style>
