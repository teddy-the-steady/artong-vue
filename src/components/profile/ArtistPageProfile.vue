<template>
  <div class="profile">
    <div v-if="isFirstLoading" class="image">
      <skeleton-box style="width:100%;height:100%;border-radius:50%;"></skeleton-box>
    </div>
    <div v-else class="image">
      <img v-if="profileImageUrl"
        :src="profileImageUrl"
        @error="hasErrorGettingImage = true"
        class="profileImage"
        :class="{error: hasErrorGettingImage}"
      />
      <div v-else class="basicProfileImage"></div>
    </div>
    <div class="info">
      <div class="username"> <!--userName이 필요할 때만 표시-->
        {{ $route.params.id }}
      </div>
      <div class="display-name">
        {{ member? member.display_name : '' }}  <!--이게 뭐임? 안 쓰는 거임-->
      </div>
      <div class="intro">
        {{ member? member.introduction : '' }}
      </div>
    </div>
  </div>
</template>

<script>
import { headerActivate } from '../../mixin'
import { makeS3Path } from '../../util/commonFunc'
import SkeletonBox from '../util/SkeletonBox'

export default {
  name: 'ArtistPageProfile',
  components: {
    SkeletonBox
  },
  mixins: [headerActivate],
  data() {
    return {
      profileImageUrl: '',
      isFirstLoading: true,
      hasErrorGettingImage: false,
      userName: "@Creator Name", // 서버에서 받은 이름 데이터를 여기에 넣어주면 됨
      collectionCount: "5"
    }
  },
  props: {
    member: {
      type: Object,
      default: () => {}
    },
  },
  methods: {
    getProfileImageUrl(member) {
      return member.profile_thumbnail_s3key ?
        makeS3Path(member.profile_thumbnail_s3key) :
        makeS3Path(member.profile_s3key)
    },
    onEmit(){
      this.$emit("setValue", this.userName, this.collectionCount);
    }
  },
  watch: {
    member: {
      deep: true,
      handler(val) {
        if (val) {
          this.profileImageUrl = this.getProfileImageUrl(this.member)
          this.isFirstLoading = false
        }
      }
    }
  },
  mounted(){
    this.onEmit()
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/variables';

.profile {
    display: flex;
    margin-left: 15%;

    .image {
        display: inline-block;
        background-color: $artong-white;
        width: 150px;
        height: 150px;
        border-radius: 50%;
        border: 2px solid $artong-white;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 50%;
        }

        .profileImage {
          &.error {
            background: url('../../assets/images/profile.svg') 50% 50% no-repeat;
            text-indent: -10000px;
          }
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
      text-align: center;
      word-break: break-all;

      .username {
        font-size: 1.5em;
      }
    }
}

@media only screen and (max-width: 599px) {
  .profile {
    //transform: translateY(-30%);
    flex-direction: column;
    align-items: center;
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
  }
}
</style>