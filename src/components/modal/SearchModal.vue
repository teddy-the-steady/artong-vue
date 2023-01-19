<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-header">
            <slot name="header">
              <input placeholder="Search" v-show="innerWidth < 1080" />
            </slot>
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
import { mapState } from 'vuex'

export default {
  name: 'BasicModal',
  props: {
    isSearchModalOpen: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapState({
      innerWidth: state => state.menu.innerWidth,
    }),
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
      padding: 20px 30px;
      background-color: $artong-white;
      transition: all 0.3s ease;
      font-family: Helvetica, Arial, sans-serif;
      position: absolute;
      left: calc(50% - 240px);
      top: 70px;
      width: 480px;
      min-height: 196px;
      box-shadow: 2px 2px 12px rgba(0, 0, 0, 0.14);
      border-radius: 14px;

      .modal-header {
        font-size: 20px;
        color: $lightgray;
        input {
          width: 95%;
          border: none;
          border-bottom: 1px solid #ccc;
          height: calc(1.5em + 0.75rem + 2px);
          padding: 0.375rem 0.75rem;
          font-family: 'Pretendard';
          font-style: normal;
          font-weight: 400;
          font-size: 14px;
        }
        input:focus {
          outline: none;
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

@media (max-width: 500px) {
  .modal-mask {
    .modal-wrapper {
      padding: auto 10px;
      .modal-container {
        width: 100%;
        left: auto;
      }
    }
  }
}
</style>
