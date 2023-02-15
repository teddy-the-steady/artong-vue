<template>
  <div class="upload">
    <img v-if="image" :src="image" @click="$refs.fileInput.click()" />
    <img
      v-else
      class="add-photo"
      src="../../../assets/icons/add-photo.svg"
      @click="$refs.fileInput.click()"
    />
    <input ref="fileInput" type="file" @change="onFileChange" />
    {{ errorMessage }}
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Storage from '@aws-amplify/storage'
import { postContent } from '../../../api/contents'
// TODO] 이미지 올려도 안넘어가는 이슈. 이미지 올라가는동안 next버튼 살아있음. disable 해주자
export default {
  name: 'MintStep0',
  props: {
    project: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    ...mapState({
      currentUser: state => state.user.currentUser,
    }),
  },
  data() {
    return {
      file: null,
      image: null,
      errorMessage: null,
      S3_PRIVACY_LEVEL: 'public',
    }
  },
  methods: {
    findFileType(file) {
      let fileType = file.type
      let fileLength = file.length
      let fileSlash = file.type.lastIndexOf('/')
      fileType = file.type.substring(fileSlash + 1, fileLength)
      return fileType
    },
    checkFileTypeValidity(fileType) {
      switch (fileType) {
        case 'gif':
        case 'jpg':
        case 'jpeg':
        case 'png':
          return true
        default:
          return false
      }
    },
    async onFileChange(e) {
      this.file = e.target.files[0]
      let fileType = this.findFileType(this.file)
      let fileTypeValidity = this.checkFileTypeValidity(fileType)
      if (!fileTypeValidity) {
        alert(this.$i18n.t('views.project.mint-modal.alert.add-image'))
        return
      }
      this.$emit('data-from-step0', 'uploadingToS3', true)
      this.image = URL.createObjectURL(this.file)
      URL.revokeObjectURL(this.file)

      const postResult = await postContent({
        project_address: this.project.id,
        content_s3key: `${this.S3_PRIVACY_LEVEL}/nft/${this.project.id}/${this.currentUser.id}/${this.file.name}`,
      })
      const s3Result = await this.uploadToS3(
        this.project.id,
        this.currentUser.id,
        this.file.name,
      )
      this.$emit('data-from-step0', 'uploadingToS3', false)
      this.$emit('data-from-step0', 'postResult', postResult)
      this.$emit('data-from-step0', 's3Result', s3Result)
    },
    async uploadToS3(projectsAddress, memberId, fileName) {
      try {
        const result = await Storage.put(
          `nft/${projectsAddress}/${memberId}/${fileName}`,
          this.file,
          {
            level: this.S3_PRIVACY_LEVEL,
            contentType: this.file.type,
          },
        )
        return result
      } catch (error) {
        this.errorMessage = 'Oops, something went wrong! Please try again'
        this.image = null
        this.file = null
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.upload {
  img {
    max-width: 80%;
  }
  .add-photo {
    width: 60%;
  }
  input[type='file'] {
    display: none;
  }
}
</style>
