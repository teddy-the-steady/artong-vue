<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div>
            <img class="logo" src="../../assets/icons/notification.svg" />
            <h2>{{ $t('header.user-dialog.notification') }}</h2>
          </div>
          <div class="scrollable-container">
            <div class="modal-header">
              <slot name="header"></slot>
            </div>

            <div class="modal-body">
              <slot name="body">
                <Notification />
              </slot>
            </div>

            <div class="modal-footer">
              <slot name="footer">
                <button class="modal-button" @click="toggleNotificationModal">
                  X
                </button>
              </slot>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapState } from 'vuex'
import Notification from '../menu/Notification.vue'

export default {
  components: { Notification },
  name: 'NotificationModal',
  data() {
    return {}
  },
  computed: {
    ...mapState({
      isNotificationModalOpen: state => state.menu.isNotificationModalOpen,
    }),
  },
  methods: {
    toggleNotificationModal() {
      this.$store.commit('TOGGLE_NOTIFICATION_MODAL')
      this.notification = []
    },
  },
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/variables';

.modal-mask {
  position: fixed;
  // z-index: 9998;
  top: 75px;
  right: 0;
  // width: 100vw;
  // height: 100vh;
  // background-color: $backdrop;
  display: table;
  transition: opacity 0.2s ease;

  .modal-wrapper {
    display: table-cell;
    vertical-align: middle;

    .modal-container {
      display: grid;
      width: 420px;
      margin-right: 5px;
      padding: 5px 5px;
      background-color: $artong-white;
      border-radius: 2px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
      transition: all 0.3s ease;
      border-radius: 20px;
      .logo {
        float: left;
        margin-left: 12px;
        margin-top: 10px;
        scale: 0.7;
        width: 40px;
      }
      h2 {
        float: left;
        margin-left: 10px;
        width: 50px;
      }

      .scrollable-container {
        overflow-y: auto;
        max-height: 40vh;
        max-width: 80vw;
        .modal-header {
          float: right;
          color: $lightgray;
        }

        .modal-body {
          margin: 0px 5px;
          // display: contents;
        }

        .modal-footer {
          .modal-button {
            position: fixed;
            z-index: 9998;
            top: 85px;
            right: 25px;
            width: 10px;
            background-color: #ffffff;
            border: 0px;
            color: black;
          }
        }
      }
    }
  }
}

.modal-enter {
  opacity: 100;
}

.modal-leave-active {
  opacity: 0;
}

.text-left {
  text-align: left;
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
