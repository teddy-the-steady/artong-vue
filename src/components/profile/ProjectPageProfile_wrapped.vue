<template>
  <div class="project">
    <div v-if="isFirstLoading" class="image">
      <SkeletonBox class="skeleton-box" style="width:84%;height:84%;"></SkeletonBox>
    </div>
    <div v-else @error="isFirstLoading = true" class="image2"> <!--class="image" 뺌-->
      <img v-if="projectImageUrl" :src="projectImageUrl"/>
      <div v-else class="basicProfileImage"></div>
    </div>
    <div class="info" v-if="needProjectName&&!isFirstLoading">
      <div class="username">
        hello
        {{ $route.params.id }}
      </div>
    </div>
    <div class="info" v-else-if="needProjectName&&isFirstLoading">
      <div class="username_box">
        <SkeletonBox style="width:100%;height:100%"></SkeletonBox>
      </div>
    </div>
  </div>
</template>

<script>
import { headerActivate } from '../../mixin'
import SkeletonBox from '../util/SkeletonBox'

export default {
  name: 'ProjectPageProfile_wrapped',
  components: {
    SkeletonBox
  },
  mixins: [headerActivate],
  props:{
    needProjectName:{
      type:Boolean,
      default:false
    }
  },
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
    //margin-left: 15%;
    //transform: translateY(-40%);

    .image {
      display: inline-block;
      //background-color: $artong-white;
      width: 100px;
      height: 100px;
      min-width: 100px;
      min-height: 100px;
      border-radius: 15px;
      border: 2px solid $profile-border-red;

      .skeleton-box {
        background-color: $lightergray;
        width: 84px;
        height: 84px;
        min-width: 84px;
        min-height: 84px;
        border-radius: 15px;
        overflow:hidden;
        margin:8px;
      }

      // input {
      //   display: none;
      // }
    }
    .image2{
      display: inline-block;
      //background-color: $artong-white;
      width: 100px;
      height: 100px;
      border-radius: 15px;
      border: 2px solid $profile-border-red;
      img{
        width: 84px;
        height: 84px;
        object-fit: cover;
        border-radius: 15px;
        margin: 8px;
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
      margin-left:16px;
      height:38px;

      .username {
        font-family: $item-font;
        font-style: $item-font-style;
        font-weight: 700;
        font-size: 32px;
        line-height: 100px;
      }
      .username_box{
        margin-top:31px;
        width:248px;
        height:38px;
        border-radius:10px;
        overflow:hidden;
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