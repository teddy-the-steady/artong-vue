<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-header">
            <slot name="header"></slot>
          </div>

          <div class="modal-body">
            <slot name="body">
              <input type="text" v-model="price" placeholder="Price in ETH" />
            </slot>
          </div>

          <div class="modal-footer">
            <slot name="footer">
              <button class="modal-button" @click="confirm()">
                <div
                  class="spinner"
                  :class="{ active: confirmOnProcess }"
                ></div>
                <span v-show="!confirmOnProcess">{{ okButton }}</span>
              </button>
              <button
                class="modal-button"
                :class="{ disabled: cancelDisabled }"
                @click="cancel()"
              >
                {{ cancelButton }}
              </button>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'PromptModal',
  props: {
    confirmOnProcess: {
      type: Boolean,
      default: false,
    },
    cancelDisabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      okButton: 'Continue',
      cancelButton: 'Cancel',
      resolvePromise: null,
      rejectPromise: null,
      price: null,
    }
  },
  methods: {
    waitForAnswer() {
      return new Promise((resolve, reject) => {
        this.resolvePromise = resolve
        this.rejectPromise = reject
      })
    },
    confirm() {
      this.resolvePromise(this.price)
    },
    cancel() {
      this.rejectPromise(new Error('canceled'))
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
  height: 100vh;
  background-color: $backdrop;
  display: table;
  transition: opacity 0.3s ease;

  .modal-wrapper {
    display: table-cell;
    vertical-align: middle;

    .modal-container {
      width: 300px;
      margin: 0px auto;
      padding: 20px 30px;
      background-color: $artong-white;
      border-radius: 2px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
      transition: all 0.3s ease;
      font-family: Helvetica, Arial, sans-serif;
      border-radius: 20px;

      .modal-header {
        float: right;
        font-size: 20px;
        color: $lightgray;
      }

      .modal-body {
        margin: 20px 0;
      }

      .modal-footer {
        .modal-button {
          padding: 10px;
          margin: 10px;
          width: 40%;
          .spinner {
            display: none;

            &.active {
              display: inline-block;
              position: relative;
              width: 2px;
              margin: 0px auto;
              animation: rotation 0.6s infinite linear;
              border-left: 6px solid rgba(0, 174, 239, 0.15);
              border-right: 6px solid rgba(0, 174, 239, 0.15);
              border-bottom: 6px solid rgba(0, 174, 239, 0.15);
              border-top: 6px solid $artong-white;
              border-radius: 100%;
            }
          }

          @keyframes rotation {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(359deg);
            }
          }
          button {
            width: 100%;
          }

          & > span:nth-child(2) {
            align-self: center;
          }
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
