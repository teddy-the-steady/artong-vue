<template>
  <div class="project">
    <div v-if="isFirstLoading" class="image">
      <SkeletonBox style="width: 100%; height: 100%"></SkeletonBox>
    </div>
    <div v-else @error="isFirstLoading = true">
      <!--class="image" 뺌 onerror 수정-->
      <img v-if="projectImageUrl" :src="projectImageUrl" class="realImage" />
      <div v-else class="basicProfileImage"></div>
    </div>
    <div class="info" v-if="needProjectName && !isFirstLoading">
      <div class="username">
        hello
        {{ $route.params.id }}
      </div>
    </div>
    <div class="info" v-else-if="needProjectName && isFirstLoading">
      <div class="username_box">
        <SkeletonBox style="width: 100%; height: 100%"></SkeletonBox>
      </div>
    </div>
  </div>
</template>

<script>
import { headerActivate } from '../../mixin'
import SkeletonBox from '../util/SkeletonBox.vue'

export default {
  name: 'ProjectPageProfile',
  components: {
    SkeletonBox,
  },
  mixins: [headerActivate],
  props: {
    needProjectName: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      projectImageUrl: '',
      isFirstLoading: true,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/variables';

.project {
  display: flex;
  //margin-left: 15%;
  //transform: translateY(-40%);

  .image {
    display: inline-block;
    background-color: $artong-white;
    width: 100px;
    height: 100px;
    min-width: 100px;
    min-height: 100px;
    border-radius: 15px;
    overflow: hidden;
  }
  .realImage {
    width: 100px;
    height: 100px;
    object-fit: cover;
    border: 1px solid $profile-border-gray;
    border-radius: 15px;
  }
  .basicProfileImage {
    width: 100px;
    height: 100px;
    object-fit: fill;
    border: 1px solid $profile-border-gray;
    border-radius: 15px;
    background: url('../../assets/images/profile.svg') 50% 50% no-repeat;
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
    //transform: translateY(-30%);
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
