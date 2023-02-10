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
export default {
  name: 'BasicDialog',
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
  top: 80%;
  right: 0%;
  outline: 0;

  .dialog-wrapper {
    display: table-cell;
    vertical-align: middle;

    .dialog-container {
      width: 150px;
      background-color: $artong-white;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
      transition: all 0.3s ease;
      border-radius: 10px;
      overflow: hidden;

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
          color: $artong-black;
          font-weight: 500;
          transition: background 0.3s;
          &:hover {
            background: $lightergray
              radial-gradient(circle, transparent 1%, $lightergray 1%)
              center/15000%;
          }
        }
      }
    }
  }
}
</style>
