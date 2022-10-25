<template>
  <div class="project">
    <div v-if="isFirstLoading" class="image">
      <skeleton-box style="width:100%;height:100%;"></skeleton-box>
    </div>
    <div v-else class="image">
      <img v-if="projectImageUrl" :src="projectImageUrl"/>
      <div v-else class="basicProfileImage"></div>
    </div>
    <div class="info">
      <div class="username">
        {{ $route.params.id }}
      </div>
    </div>
  </div>
</template>

<script>
import { headerActivate } from '../../mixin'
import SkeletonBox from '../util/SkeletonBox'

export default {
  name: 'ProjectPageProfile',
  components: {
    SkeletonBox
  },
  mixins: [headerActivate],
  data() {
    return {
      projectImageUrl: '',
      isFirstLoading: true
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/variables';

.project {
    display: flex;
    margin-left: 15%;
    transform: translateY(-40%);

    .image {
      display: inline-block;
      background-color: $artong-white;
      width: 150px;
      height: 150px;
      min-width: 100px;
      min-height: 100px;
      border: 2px solid $artong-white;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 50%;
      }

      .basicProfileImage {
        height: 100%;
        border-radius: 50%;
        background: url('../../assets/images/profile.svg') 50% 50% no-repeat;
      }

      input {
        display: none;
      }
    }

    .info {
      word-break: break-all;

      .username {
        font-size: 1.5em;
        position: relative;
        top: 65px;
        left: 5px;
      }
    }
}

@media only screen and (max-width: 599px) {
  .project {
    transform: translateY(-30%);
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