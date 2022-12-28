<template>
  <div class="dialog-mask" @focusout="handleFocusOut" tabindex="0">
    <div class="dialog-wrapper">
      <div class="dialog-container">
        <div class="dialog-header">
          <slot name="header"></slot>
        </div>

        <div class="dialog-body" @click="dialogClick">
          <slot name="body"></slot>
        </div>

        <div class="dialog-footer">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'UserDialog',
  computed: {
    ...mapState({
      currentUser: state => state.user.currentUser,
    }),
  },
  methods: {
    handleFocusOut() {
      this.$emit('dialog-focus-out')
    },
    dialogClick() {
      this.$emit('dialog-focus-out')
    },
  },
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/variables';

.dialog-mask {
  position: absolute;
  z-index: 9998;
  top: 45px;
  right: 10px;
  outline: 0;

  .dialog-wrapper {
    display: table-cell;
    vertical-align: middle;

    .dialog-container {
      width: 150px;
      background-color: $artong-white;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
      transition: all 0.3s ease;

      .dialog-header {
        float: right;
        font-size: 20px;
        color: $lightgray;
      }

      .dialog-body {
        div {
          font-size: 20px;
          padding: 10px;
          cursor: pointer;
          text-align: left;
        }
      }
    }
  }
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
