<template>
  <div>
    <button class="dropdown" @mousedown="sortMouseDown" @mouseup="sortMouseUp">
      <div>Newest</div>
      <img src="../../assets/icons/arrow_down.svg" />
    </button>
    <BasicDialog
      class="dialog"
      :class="{ active: isDialogActive }"
      @dialog-focus-out="closeDialog"
      ref="dialog"
    >
      <div slot="body">Newest</div>
      <div slot="body">Oldest</div>
    </BasicDialog>
  </div>
</template>

<script>
import BasicDialog from '../dialog/BasicDialog.vue'

export default {
  name: 'SortDropdown',
  components: { BasicDialog },
  props: {
    options: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      isDialogActive: false,
      isMouseDownSort: false,
      isMouseUpSort: false,
    }
  },
  methods: {
    closeDialog() {
      this.isDialogActive = false
      this.isMouseDownSort = false
      this.isMouseUpSort = false
    },
    sortMouseDown() {
      this.isMouseDownSort = true
    },
    sortMouseUp() {
      this.isMouseUpSort = true
      if (this.isMouseDownSort) {
        this.isDialogActive = true
      }
    },
  },
  watch: {
    isDialogActive(val) {
      if (val) {
        this.$nextTick(() => this.$refs.dialog.$el.focus())
      }
    },
  },
}
</script>

<style lang="scss" scoped>
img {
  width: 9.5px;
}
.dialog {
  display: none;
  &.active {
    display: block;
  }
}
</style>
