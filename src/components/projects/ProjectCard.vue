<template>
  <div class="wrapper">
    <div class="background">
      <img
        ref="backgroundImage"
        :src="
          backgroundImagePath(
            project.background_thumbnail_s3key || project.background_s3key,
          )
        "
      />
    </div>
    <div class="top">
      <ProjectPageProfile_wrapped
        class="profile"
        :projectImageUrl="
          project.project_thumbnail_s3key || project.project_s3key
        "
      ></ProjectPageProfile_wrapped>
      <div class="symbol">
        {{ project.symbol ? project.symbol.toUpperCase() : '' }}
      </div>
    </div>
    <div class="name">
      <div>{{ project.name }}</div>
    </div>
    <div class="bottom">
      <ContentsProfileBundle
        class="bundle"
        :members="project.contributors"
      ></ContentsProfileBundle>
      <div class="contributors">
        <span class="nickName">
          @{{
            project.contributors && project.contributors.length > 0
              ? project.contributors[0].username
              : 'nickName'
          }}
        </span>
        <span class="count">
          {{
            project.contributors && project.contributors.length > 1
              ? `+${project.contributors.length - 1}`
              : ''
          }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import ProjectPageProfile_wrapped from '../profile/ProjectPageProfile_wrapped.vue'
import ContentsProfileBundle from '../profile/ContentsProfileBundle.vue'
import { makeS3Path } from '../../util/commonFunc'

export default {
  name: 'ProjectCard',
  components: { ProjectPageProfile_wrapped, ContentsProfileBundle },
  props: {
    project: {
      type: Object,
      default: () => {
        return {
          background_s3key: '',
          background_thumbnail_s3key: '',
          symbol: '',
        }
      },
    },
  },
  methods: {
    makeS3Path(path) {
      return makeS3Path(path)
    },
    backgroundImagePath(backgroudnImageUrl) {
      return this.makeS3Path(backgroudnImageUrl)
    },
  },
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/variables';

.wrapper {
  position: relative;
  overflow: hidden;
  border-radius: 15px;
  margin: 16px;
  box-shadow: 2px 2px 12px rgb(0 0 0 / 14%);

  .background {
    position: absolute;
    width: 100%;
    height: 100%;
    background: $lightgray;
    img {
      height: 100%;
      width: 100%;
      object-fit: cover;
      opacity: 0.8;
      filter: blur(3px);
    }
  }

  .top {
    display: flex;
    flex-direction: row;
    margin-top: 24px;
    position: relative;

    .profile {
      margin-left: 24px;
    }
    .symbol {
      position: absolute;
      right: 24px;
      width: 92px;
      height: 25px;

      border: 2px solid $profile-border-red;
      border-radius: 999px;

      font-family: $item-font;
      font-style: $item-font-style;
      font-weight: 800;
      font-size: 14px;
      line-height: 25px;

      overflow: hidden !important;
      text-overflow: ellipsis;
    }
  }
  .name {
    position: relative;
    font-family: 'Mustica Pro';
    font-style: normal;
    font-weight: 600;
    font-size: 32px;
    line-height: 44px;
    overflow: hidden !important;
    text-overflow: ellipsis;
    height: 250px;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    margin: 0 10px;
    div {
      max-height: 300px;
    }
  }
  .bottom {
    display: flex;
    margin: 16px 0;
    height: 32px;
    .bundle {
      margin-left: 35px;
    }

    .contributors {
      font-family: $item-font;
      font-style: $item-font-style;
      font-weight: 500;
      font-size: 14px;
      line-height: 32px;
      color: $artong-white;
      display: flex;
      position: relative;
      margin-left: 10px;
      .nickName {
        display: inline-block;
        max-width: 80px;
        white-space: nowrap;
        overflow: hidden !important;
        text-overflow: ellipsis;
        margin-right: 5px;
      }
    }
  }
}
</style>
