<template>
  <div class="wrapper">
    <div class="top">
      <ProjectPageProfile_small
        class="project-profile"
      ></ProjectPageProfile_small>
      <div class="description">NFT name</div>
    </div>
    <div class="bottom">
      <ContentsProfile class="content-profile"></ContentsProfile>
      <div class="price-title">현재 입찰가</div>
      <div class="price">0.25 ETH</div>
    </div>
  </div>
</template>

<script>
import ProjectPageProfile_small from '../profile/ProjectPageProfile_small.vue'
import ContentsProfile from '../profile/ContentsProfile.vue'

export default {
  name: 'ContentCard',
  components: {
    ProjectPageProfile_small,
    ContentsProfile,
  },
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/variables';

.wrapper {
  border: 1px solid #333333;
  border-radius: 15px;
  margin: 24px 16px;
  height: 453px;

  .top {
    display: flex;
    flex-direction: row;
    background-image: url(../../assets/images/art11.jpg);
    height: 330px;
    border-top-left-radius: 15px;
    border-top-right-radius: 15px;

    .project-profile {
      position: absolute;
      margin-top: 24px;
      margin-left: 16px;
    }
    .description {
      margin-top: 292px;
      margin-left: 16px;

      font-family: $item-font;
      font-style: $item-font-style;
      font-weight: 700;
      font-size: 18px;
      color: $artong-white;
    }
  }

  .bottom {
    display: flex;
    flex-direction: column;
    margin: 16px 0;
    height: 32px;
    .content-profile {
      margin-left: 16px;
    }
    .price-title {
      margin-top: 16px;
      margin-left: 16px;
      text-align: left;
      font-family: $item-font;
      font-style: $item-font-style;
      font-weight: 500;
      font-size: 14px;
      color: #808080;
    }
    .price {
      margin-top: 4px;
      margin-left: 16px;
      text-align: left;
      font-family: $item-font;
      font-style: $item-font-style;
      font-weight: 500;
      font-size: 18px;
      color: $artong-black;
    }
  }
}
</style>