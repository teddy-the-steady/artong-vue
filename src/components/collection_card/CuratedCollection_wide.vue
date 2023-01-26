<template>
  <div class="wrapper">
    <div class="top">
      <ProjectPageProfile_wrapped
        :projectImageUrl="
          project.project_thumnaiil_s3key || project.project_s3key
        "
      ></ProjectPageProfile_wrapped>
      <div class="collection-name">Collection Name</div>
    </div>
    <div class="middle">
      <ContentsProfileBundle
        :members="project.contributors"
      ></ContentsProfileBundle>
      <div class="nickName">
        @{{ project.contributors[0].username }} +{{
          project.contributors.length
        }}
      </div>
      <div class="category">{{ project.symbol }}</div>
    </div>
    <div class="description">
      {{ project.description }}
    </div>
  </div>
</template>
<script>
import ProjectPageProfile_wrapped from '../profile/ProjectPageProfile_wrapped.vue'
import ContentsProfileBundle from '../profile/ContentsProfileBundle.vue'

export default {
  name: 'CuratedCollection',
  components: {
    ProjectPageProfile_wrapped,
    ContentsProfileBundle,
  },
  props: {
    project: {
      type: Object,
      default: () => {},
    },
  },
  created() {
    console.log(this.project)
  },
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/variables';

.wrapper {
  border: 1px solid #333333;
  border-radius: 15px;
  width: 95%;
  .top {
    margin-top: 24px;
    margin-left: 24px;
    display: flex;
    flex-direction: row;
    .collection-name {
      font-family: $item-font;
      font-style: $item-font-style;
      font-weight: 700;
      font-size: 32px;
      color: $artong-white;
      margin-left: 16px;
      line-height: 100px;
    }
  }
  .middle {
    margin-left: 24px;
    margin-top: 16px;
    display: flex;
    flex-direction: row;
    position: relative;
    .nickName {
      line-height: 30px;
      font-family: $item-font;
      font-style: $item-font-style;
      font-weight: 500;
      font-size: 14px;
      color: $artong-white;
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
    width: 660px;
    margin-left: 24px;
    margin-bottom: 24px;
    text-align: left;
    color: $artong-white;
  }
}
@media (min-width: 1440px) {
  .wrapper {
    width: 692px;
  }
}
</style>
