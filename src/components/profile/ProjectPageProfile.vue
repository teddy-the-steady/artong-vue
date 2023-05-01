<template>
  <div class="project">
    <div v-if="isFirstLoading" class="image">
      <SkeletonBox style="width: 100%; height: 100%"></SkeletonBox>
    </div>
    <div v-else @error="isFirstLoading = true">
      <img
        v-if="projectImage"
        :src="projectImage"
        class="realImage"
        :class="{ pointer: isProjectOwner }"
        @click="imageClick"
      />
      <div
        v-else
        class="basicProfileImage"
        :class="{ pointer: isProjectOwner }"
        :style="{ background: backgroundColor }"
        @click="imageClick"
      ></div>
      <input ref="fileInput" type="file" @change="onFileChange" />
    </div>
    <div class="info" v-if="needProjectName && !isFirstLoading">
      <div class="username">
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
import Storage from '@aws-amplify/storage'
import { mapState } from 'vuex'
import { headerActivate, backgroundColor } from '../../mixin'
import { makeS3Path } from '../../util/commonFunc'
import { patchProject } from '../../api/projects'
import SkeletonBox from '../util/SkeletonBox.vue'

export default {
  name: 'ProjectPageProfile',
  components: {
    SkeletonBox,
  },
  mixins: [headerActivate, backgroundColor],
  props: {
    project: {
      type: Object,
      default: () => {},
    },
    needProjectName: {
      type: Boolean,
      default: false,
    },
    isFirstLoading: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    ...mapState({
      currentUser: state => state.user.currentUser,
    }),
    isProjectOwner() {
      return (
        this.currentUser.wallet_address === this.project.owner.wallet_address
      )
    },
    projectImage() {
      return makeS3Path(
        this.project.project_thumbnail_s3key || this.project.project_s3key,
      )
    },
    backgroundColor() {
      return this.generateGradientBackground(this.project.id)
    },
  },
  data() {
    return {
      S3_PRIVACY_LEVEL: 'public',
    }
  },
  methods: {
    makeS3Path(path) {
      return makeS3Path(path)
    },
    imageClick() {
      if (!this.isProjectOwner) {
        return
      }
      this.$refs.fileInput.click()
    },
    async onFileChange(e) {
      const file = e.target.files[0]
      await this.uploadProjectImage(file)
    },
    async uploadProjectImage(file) {
      const fileName = `${Date.now()}-${file.name}`
      const result = await Storage.put(
        `project/${this.project.txHash}/profile/${fileName}`,
        file,
        {
          level: this.S3_PRIVACY_LEVEL,
          contentType: file.type,
        },
      )
      if (result) {
        const patchResult = await patchProject(this.project.txHash, {
          project_s3key: `${this.S3_PRIVACY_LEVEL}/${result.key}`,
        })
        this.project.project_s3key = patchResult.project_s3key
      }
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
    border-radius: 15px;
    &.pointer {
      cursor: pointer;
    }
  }
  .basicProfileImage {
    width: 100px;
    height: 100px;
    border-radius: 15px;
    border: 1px solid $profile-border-gray;
    &.pointer {
      cursor: pointer;
    }
  }
  input[type='file'] {
    display: none;
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
