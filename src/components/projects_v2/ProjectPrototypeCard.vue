<template>
  <div class="wrapper">
    <div class="top">
      <ProjectPageProfile_wrapped class="profile"></ProjectPageProfile_wrapped>
      <div class="symbol">{{ symbol.toUpperCase() }}</div>
    </div>
    <div class="name">{{ name }}</div>
    <div class="bottom">
      <ContentsProfileBundle class="bundle"></ContentsProfileBundle>
      <div class="contributors">@contributor +4</div>
    </div>
  </div>
</template>

<script>
import ProjectPageProfile_wrapped from '../profile/ProjectPageProfile_wrapped.vue'
import ContentsProfileBundle from '../profile/ContentsProfileBundle.vue'
export default {
  name: 'ProjectPrototypeCard',
  components: { ProjectPageProfile_wrapped, ContentsProfileBundle },
  props: {
    name: {
      type: String,
      default: '',
    },
    symbol: {
      type: String,
      default: 'SYMBOL',
    },
  },
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/variables';

.wrapper {
  border: 1px solid $lightgray;
  border-radius: 15px;
  margin: 24px 16px;
  background: linear-gradient(45deg, $darkgray, transparent);

  .top {
    display: flex;
    flex-direction: row;
    margin-top: 24px;
    position: relative;

    .profile {
      margin-left: 24px;
      cursor: pointer;
    }
    .symbol {
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

      overflow: hidden !important;
      text-overflow: ellipsis;
    }
  }
  .name {
    margin-top: 213px;
    margin-left: 30px;
    font-family: 'Mustica Pro';
    font-style: normal;
    font-weight: 600;
    font-size: 32px;
    line-height: 44px;
    color: $artong-white;
    width: 300px;
    overflow: hidden !important;
    text-overflow: ellipsis;
  }
  .bottom {
    display: flex;
    margin: 16px 0;
    height: 32px;
    .bundle {
      margin-left: 35px;
    }
    .contributors {
      width: 150px;
      text-align: left;
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
