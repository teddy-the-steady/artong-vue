<template>
  <transition name="dialog">
    <div class="dialog-mask">
      <div class="dialog-wrapper">
        <div class="dialog-container">

          <div class="dialog-header">
            <slot name="header"></slot>
          </div>

          <div class="dialog-body">
            <slot name="body">
            </slot>
          </div>

          <div class="dialog-footer">
            <slot name="footer">
              <button class="modal-default-button">
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

export default {
  name: 'UserDialog',
  computed: {
    ...mapState({
      currentUser: state => state.user.currentUser
    })
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/variables';

.dialog-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: $backdrop;
  display: table;
  transition: opacity .3s ease;

  .dialog-wrapper {
    display: table-cell;
    vertical-align: middle;

    .dialog-container {
      width:300px;
      margin: 0px auto;
      padding: 20px 30px;
      background-color: $artong-white;
      border-radius: 2px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
      transition: all .3s ease;
      font-family: Helvetica, Arial, sans-serif;

      .dialog-header {
        float: right;
        font-size: 20px;
        color: $lightgray;
      }

      .dialog-body {
        margin: 20px 0;
      }

      .dialog-footer {
        .dialog-default-button {
          float: right;
          width: 100px;
        }
      }
    }
  }
}

.dialog-enter {
  opacity: 0;
}

.dialog-leave-active {
  opacity: 0;
}

.dialog-enter .dialog-container,
.dialog-leave-active .dialog-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}

@media only screen and (max-width: 599px) {
  .dialog-mask {
    .dialog-wrapper {
      .dialog-container {
        width: auto;
      }
    }
  }
}
</style>
