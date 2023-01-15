<template>
  <div>
    <button
      v-if="innerWidth >= 1150"
      class="dropdown ripple"
      @mousedown="sortMouseDown"
      @mouseup="sortMouseUp"
      @touchstart="sortTouchStart"
      @touchend="sortTouchEnd"
    >
      <div>{{ sortSelected.name || 'Newest' }}</div>
      <img
        :class="{ active: isDialogActive }"
        src="../../assets/icons/arrow_down.svg"
      />
    </button>
    <button
      v-else
      class="white-button round-button ripple"
      @mousedown="sortMouseDown"
      @mouseup="sortMouseUp"
      @touchstart="sortTouchStart"
      @touchend="sortTouchEnd"
    >
      <img
        :class="{ active: isDialogActive }"
        src="../../assets/icons/arrow_down.svg"
      />
    </button>
    <BasicDialog
      class="dialog"
      :class="{ active: isDialogActive }"
      @dialog-focus-out="closeDialog"
      ref="dialog"
    >
      <div
        slot="body"
        v-for="(option, name) in sortOptions"
        :key="name"
        @click="sort(name)"
      >
        {{ option.name }}
      </div>
    </BasicDialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import BasicDialog from '../dialog/BasicDialog.vue'

export default {
  name: 'SortDropdown',
  components: { BasicDialog },
  props: {
    sortOptions: {
      type: Object,
      default: () => {},
    },
    sortSelected: {
      type: Object,
      default: () => {
        return { name: 'Newest' }
      },
    },
  },
  computed: {
    isMobile() {
      return this.$isMobile()
    },
    ...mapState({
      innerWidth: state => state.menu.innerWidth,
    }),
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
      if (!this.isMobile) {
        this.isMouseDownSort = true
      }
    },
    sortMouseUp() {
      if (!this.isMobile) {
        this.isMouseUpSort = true
        if (this.isMouseDownSort) {
          this.isDialogActive = true
        }
      }
    },
    sortTouchStart() {
      if (this.isMobile) {
        this.isMouseDownSort = true
      }
    },
    sortTouchEnd() {
      if (this.isMobile) {
        this.isMouseUpSort = true
        if (this.isDialogActive) {
          this.isDialogActive = false
          return
        }
        if (this.isMouseDownSort) {
          this.isDialogActive = true
        }
      }
    },
    sort(option) {
      if (this.sortSelected.name.toLowerCase() === option) {
        return
      }
      this.$router.push({
        path: this.$route.path,
        query: { ...this.$route.query, sort: option },
      })
    },
  },
  watch: {
    isDialogActive() {
      if (!this.isMobile) {
        this.$nextTick(() => this.$refs.dialog.$el.focus())
      }
    },
  },
}
</script>

<style lang="scss" scoped>
img {
  &.active {
    transition: 0.1s transform ease;
    transform: rotate(180deg);
  }
  width: 9.5px;
}
.dialog {
  display: none;
  &.active {
    display: block;
    z-index: 1;
    transform: translateY(16px);
  }
}
</style>
