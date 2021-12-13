<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">

          <div class="modal-header">
            <slot name="header">
              <span @click="$emit('close')">X</span>
            </slot>
          </div>

          <div class="modal-body">
            <slot name="body">
              <div class="upload">
                {{ message }}
                <img v-if="image" :src="image"/>
                <input ref="fileInput" type="file" @change="onFileChange">
              </div>
            </slot>
          </div>

          <div class="modal-footer">
            <slot name="footer">
              <button class="modal-default-button" @click="uploadImage">
                OK
              </button>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapState } from 'vuex'
import { Storage } from 'aws-amplify'

export default {
  name: 'UploadModal',
  computed: {
    ...mapState({
      currentUser: state => state.user.currentUser
    })
  },
  data() {
    return {
      file: null,
      image: '',
      message: ''
    }
  },
  methods: {
    async onFileChange(e) {
      this.file = e.target.files[0]
      this.image = URL.createObjectURL(this.file)
      this.message = ''
    },
    async uploadImage() {
      if (!this.file) {
        this.message = '업로드할 이미지가 없습니다.'
        return
      }
      try {
        await Storage.put(`${this.currentUser.username}/contents/${this.file.name}`, this.file, {
          level: 'public',
          contentType: this.file.type
        })
        this.$emit('close', true)
      } catch (error) {
        this.message = '업로드 실패. 다시 시도해주세요.'
        this.$emit('close')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/variables';

.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .5);
  display: table;
  transition: opacity .3s ease;

  .modal-wrapper {
    display: table-cell;
    vertical-align: middle;

    .modal-container {
      width:300px;
      margin: 0px auto;
      padding: 20px 30px;
      background-color: #fff;
      border-radius: 2px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
      transition: all .3s ease;
      font-family: Helvetica, Arial, sans-serif;

      .modal-header {
        float: right;
        font-size: 20px;
        color: $lightgray;
        cursor: pointer;
        h3 {
          margin-top: 0;
          color: #42b983;
        }
      }

      .modal-body {
        margin: 20px 0;
        .upload {
          img {
            width: 100%;
          }
        }
      }

      .modal-footer {
        .modal-default-button {
          float: right;
          width: 100px;
        }
      }
    }
  }
}

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}

@media only screen and (max-width: 599px) {
  .modal-mask {
    .modal-wrapper {
      .modal-container {
        width: auto;
      }
    }
  }
}
</style>
