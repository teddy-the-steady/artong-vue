<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-header">
            <slot name="header"></slot>
          </div>

          <div class="modal-body">
            <slot name="body"></slot>
          </div>

          <div class="modal-footer">
            <slot name="footer">
              <button @click="close">close</button>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'BasicModal',
  props: {
    isSearchModalOpen: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    close() {
      this.$emit('close-modal')
    },
  },
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
  background-color: $backdrop;
  display: table;
  transition: opacity 0.3s ease;

  .modal-wrapper {
    display: table-cell;
    vertical-align: middle;

    .modal-container {
      box-sizing: border-box;
      width: 482px;
      padding: 20px 30px;
      background-color: $artong-white;
      border-radius: 2px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
      transition: all 0.3s ease;
      font-family: Helvetica, Arial, sans-serif;
      position: absolute;
      left: calc(50% - 240px);
      top: 70px;

      .modal-header {
        float: right;
        font-size: 20px;
        color: $lightgray;
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
