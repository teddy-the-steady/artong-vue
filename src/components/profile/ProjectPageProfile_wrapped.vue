<template>
  <div class="project">
    <div v-if="isFirstLoading" class="image">
      <SkeletonBox
        class="skeleton-box"
        style="width: 84%; height: 84%"
      ></SkeletonBox>
    </div>
    <div v-else @error="isFirstLoading = true" class="image2">
      <img
        v-if="projectImageUrl"
        :src="projectImagePath(projectImageUrl)"
        @error="hasErrorGettingImage = true"
        :class="{ error: hasErrorGettingImage }"
      />
      <div v-else class="basicProfileImage"></div>
    </div>
  </div>
</template>

<script>
import SkeletonBox from '../util/SkeletonBox.vue'
import { makeS3Path } from '../../util/commonFunc'

export default {
  name: 'ProjectPageProfile_wrapped',
  components: {
    SkeletonBox,
  },
  props: {
    projectImageUrl: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      isFirstLoading: true,
      hasErrorGettingImage: false,
    }
  },
  methods: {
    makeS3Path(path) {
      return makeS3Path(path)
    },
    projectImagePath(projectImageUrl) {
      console.log(projectImageUrl)
      console.log(this.makeS3Path(projectImageUrl))
      return this.makeS3Path(projectImageUrl)
    },
  },
  watch: {
    projectImageUrl: {
      immediate: true,
      handler(val) {
        if (val) {
          this.isFirstLoading = false
        }
      },
    },
  },
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/variables';

.project {
  display: flex;

  .image {
    display: inline-block;
    width: 100px;
    height: 100px;
    min-width: 100px;
    min-height: 100px;
    border-radius: 15px;

    .skeleton-box {
      background-color: $lightergray;
      width: 84px;
      height: 84px;
      min-width: 84px;
      min-height: 84px;
      border-radius: 15px;
      overflow: hidden;
      margin: 8px;
    }
  }
  .image2 {
    display: inline-block;
    width: 100px;
    height: 100px;
    border-radius: 15px;
    img {
      width: 84px;
      height: 84px;
      object-fit: cover;
      border-radius: 15px;
      margin: 8px;
      &.error {
        background: $lightgray;
        text-indent: -10000px;
      }
    }
    .basicProfileImage {
      width: 84px;
      height: 84px;
      object-fit: fill;
      border-radius: 15px;
      margin: 8px;
      background: url('../../assets/images/profile.svg') 50% 50% no-repeat;
    }
  }
  .info {
    word-break: break-all;
    margin-left: 16px;
    height: 38px;

    .username {
      font-family: $item-font;
      font-style: $item-font-style;
      font-weight: 700;
      font-size: 32px;
      line-height: 100px;
    }
    .username_box {
      margin-top: 31px;
      width: 248px;
      height: 38px;
      border-radius: 10px;
      overflow: hidden;
    }
  }
}

@media only screen and (max-width: 599px) {
  .project {
    align-items: center;
    flex-direction: column;
    margin-left: 0;

    .image {
      width: 100px;
      height: 100px;
      div {
        height: 100px;
      }
      input {
        display: none;
      }
    }

    .info {
      .username {
        position: inherit;
      }
    }
  }
}
</style>
