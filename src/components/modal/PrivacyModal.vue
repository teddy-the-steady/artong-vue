<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="scrollable-container">
            <div class="modal-header">
              <slot name="header"></slot>
            </div>

            <div>
              <div>
                <Privacy class="text-left" />
                <div>
                  <button color="primary" text @click="togglePrivacyModal">
                    닫기
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import Privacy from '../../locales/ko/views/privacy.vue'
import { mapState } from 'vuex'

export default {
  name: 'PrivacyModal',
  components: {
    Privacy,
  },
  data() {
    return {
      privacy: {},
    }
  },
  computed: {
    ...mapState({
      isPrivacyModalOpen: state => state.menu.isPrivacyModalOpen,
    }),
  },
  methods: {
    togglePrivacyModal() {
      this.$store.commit('TOGGLE_PRIVACY_MODAL')
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
  width: 100vw;
  height: 100vh;
  background-color: $backdrop;
  display: table;
  transition: opacity 0.2s ease;

  .modal-wrapper {
    display: table-cell;
    vertical-align: middle;

    .modal-container {
      width: 70vw;
      margin: 10px auto;
      padding: 20px 30px;
      background-color: $artong-white;
      border-radius: 2px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
      transition: all 0.3s ease;
      border-radius: 20px;
    }
    .modal-header {
      float: right;
      color: $lightgray;
    }
    .modal-body {
      margin: 20px 0;
    }
  }
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

.scrollable-container {
  overflow-y: auto;
  max-height: 80vh;
  max-width: 80vw;
}
</style>
