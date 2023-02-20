<template>
  <div>
    <button
      class="dropdown clean"
      @mousedown="langMouseDown"
      @mouseup="langMouseUp"
      @touchstart="langTouchStart"
      @touchend="langTouchEnd"
    >
      <div>{{ languageShown }}</div>
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
        v-for="(option, name) in langOptions"
        :key="name"
        @click="langClick(option)"
      >
        {{ option.text }}
      </div>
    </BasicDialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import BasicDialog from '../dialog/BasicDialog.vue'

export default {
  name: 'LangDropdown',
  components: { BasicDialog },
  props: {
    langOptions: {
      type: Object,
      default: () => {},
    },
    savedLanguage: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    isMobile() {
      return this.$isMobile()
    },
    ...mapState({
      displayLanguage: state => state.user.display_language,
    }),
    languageShown() {
      if (this.savedLanguage) {
        return this.savedLanguage.text
      } else {
        return this.langOptions[this.displayLanguage]?.text
      }
    },
  },
  data() {
    return {
      isDialogActive: false,
      isMouseDownLang: false,
      isMouseUpLang: false,
    }
  },
  methods: {
    closeDialog() {
      this.isDialogActive = false
      this.isMouseDownLang = false
      this.isMouseUpLang = false
    },
    langMouseDown() {
      if (!this.isMobile) {
        this.isMouseDownLang = true
      }
    },
    langMouseUp() {
      if (!this.isMobile) {
        this.isMouseUpLang = true
        if (this.isMouseDownLang) {
          this.isDialogActive = true
        }
      }
    },
    langTouchStart() {
      if (this.isMobile) {
        this.isMouseDownLang = true
      }
    },
    langTouchEnd() {
      if (this.isMobile) {
        this.isMouseUpLang = true
        if (this.isDialogActive) {
          this.isDialogActive = false
          return
        }
        if (this.isMouseDownLang) {
          this.isDialogActive = true
        }
      }
    },
    langClick(option) {
      if (
        this.langOptions[this.displayLanguage].name === option.name &&
        this.$router.currentRoute.name !== 'Settings'
      ) {
        return
      }
      this.$store.commit('SET_LANGUAGE', option.name)
      this.$emit('language-selected', option)
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
