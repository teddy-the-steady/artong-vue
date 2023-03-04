<template>
  <router-link
    :to="{
      name: 'Project',
      params: {
        id: project ? project.slug || project.id || project.address : '',
      },
    }"
  >
    <div class="project">
      <div v-if="isFirstLoading" class="image">
        <SkeletonBox style="width: 100%; height: 100%"></SkeletonBox>
      </div>
      <div v-else @error="isFirstLoading = true">
        <img v-if="projectImage" :src="projectImage" class="realImage" />
        <div
          v-else
          class="basicProfileImage"
          :style="{ background: backgroundColor }"
        ></div>
      </div>
      <div class="info" v-if="!isFirstLoading">
        <div class="username">
          {{ project ? project.name : '' }}
        </div>
      </div>
      <div class="info" v-else-if="isFirstLoading">
        <div class="username_box">
          <SkeletonBox style="width: 100%; height: 100%"></SkeletonBox>
        </div>
      </div>
    </div>
  </router-link>
</template>

<script>
import { headerActivate, backgroundColor } from '../../mixin'
import SkeletonBox from '../util/SkeletonBox.vue'
import { makeS3Path } from '../../util/commonFunc'

export default {
  name: 'ProjectPageProfile_small',
  components: {
    SkeletonBox,
  },
  mixins: [headerActivate, backgroundColor],
  props: {
    project: {
      type: Object,
      default: () => {},
    },
    isFirstLoading: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    projectImage() {
      return makeS3Path(
        this.project.project_thumbnail_s3key || this.project.project_s3key,
      )
    },
    backgroundColor() {
      return this.generateGradientBackground(
        this.project.id || this.project.address,
      )
    },
  },
  methods: {
    makeS3Path(path) {
      return makeS3Path(path)
    },
  },
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/variables';

.project {
  display: flex;

  .image {
    background-color: $artong-white;
    width: 32px;
    height: 32px;
    min-width: 32px;
    min-height: 32px;
    border-radius: 4px;
    overflow: hidden;
  }
  .realImage {
    width: 32px;
    height: 32px;
    object-fit: cover;
    border-radius: 4px;
    box-shadow: 2px 2px 12px rgb(0 0 0 / 14%);
  }
  .basicProfileImage {
    width: 32px;
    height: 32px;
    object-fit: fill;
    border: 1px solid $profile-border-gray;
    border-radius: 4px;
  }

  .info {
    word-break: break-word;
    margin: auto 0 auto 8px;
    height: 100%;
    max-height: 115px;
    overflow: hidden !important;
    text-overflow: ellipsis;

    .username {
      font-family: $item-font;
      font-style: $item-font-style;
      font-weight: 500;
      font-size: 14px;
      line-height: 17px;
      text-align: left;
    }
    .username_box {
      width: 105px;
      height: 17px;
      border-radius: 4px;
      overflow: hidden;
    }
  }
}
</style>
