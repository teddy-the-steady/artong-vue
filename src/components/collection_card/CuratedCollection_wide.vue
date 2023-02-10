<template>
  <div class="wrapper">
    <router-link
      :to="{
        name: 'Project',
        params: {
          id: project.id,
        },
      }"
    >
      <div class="top">
        <ProjectPageProfile_wrapped
          :projectImageUrl="
            project.project_thumnaiil_s3key || project.project_s3key
          "
        ></ProjectPageProfile_wrapped>
        <div class="collection-name">{{ project.name }}</div>
      </div>
      <div class="middle">
        <ContentsProfileBundle
          :members="project.contributors"
        ></ContentsProfileBundle>
        <div class="nickName">
          @{{
            project.contributors && project.contributors.length > 0
              ? project.contributors[0].username
              : 'nickName'
          }}
          {{
            project.contributors && project.contributors.length > 1
              ? `+${project.contributors.length - 1}`
              : ''
          }}
        </div>
        <div class="category">{{ project.symbol }}</div>
      </div>
    </router-link>
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
    margin-bottom: 24px;
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
      display: inline-block;
      max-width: 80px;
      white-space: nowrap;
      margin-left: 5px;
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
}
@media (min-width: 1440px) {
  .wrapper {
    width: 692px;
  }
}
</style>
