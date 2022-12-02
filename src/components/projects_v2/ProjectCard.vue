<template>
  <div class="wrapper">
    <div class="top">
      <ProjectPageProfile_wrapped class="profile"></ProjectPageProfile_wrapped>
      <div class="category">category</div>
    </div>
    <div class="description">NFT art name</div>
    <div class="bottom">
      <ContentsProfileBundle class="bundle"></ContentsProfileBundle>
      <div class="nickName">@nickName +4</div>
    </div>
  </div>
</template>

<script>
import ProjectPageProfile_wrapped from '../profile/ProjectPageProfile_wrapped.vue'
import ContentsProfileBundle from '../profile/ContentsProfileBundle.vue'
export default {
  name: 'ProjectCard',
  components: { ProjectPageProfile_wrapped, ContentsProfileBundle },
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/variables';

.wrapper {
  border: 1px solid #333333;
  border-radius: 15px;
  margin: 24px 16px;

  .top {
    display: flex;
    flex-direction: row;
    margin-top: 24px;
    position: relative;

    .profile {
      margin-left: 24px;
    }
    .category {
      position: absolute;
      right: 24px;
      width: 92px;
      height: 25px;

      border: 1px solid $profile-border-red;
      border-radius: 999px;

      font-family: $item-font;
      font-style: $item-font-style;
      font-weight: 500;
      font-size: 14px;
      line-height: 25px;
      color: $profile-border-red;
    }
  }
  .description {
    margin-top: 213px;
    font-family: 'Mustica Pro';
    font-style: normal;
    font-weight: 600;
    font-size: 32px;
    line-height: 44px;
    color: $artong-white;
  }
  .bottom {
    display: flex;
    margin: 16px 0;
    height: 32px;
    .bundle {
      margin-left: 35px;
    }
    .nickName {
      font-family: $item-font;
      font-style: $item-font-style;
      font-weight: 500;
      font-size: 14px;
      line-height: 32px;
      color: $artong-white;
    }
  }
}
</style>
