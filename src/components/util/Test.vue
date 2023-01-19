<template>
  <div class="container">
    This is a test
    <button @click="openModal">click here to open modal</button>
    <SearchModal
      v-show="isSearchModalOpen"
      @close-modal="toggleSearchModal"
      ref="searchModal"
    >
      <span slot="body">search something</span>
    </SearchModal>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import SearchModal from '../../components/modal/SearchModal.vue'

export default {
  name: 'Test',
  components: {
    SearchModal,
  },
  computed: {
    ...mapState({
      isModalOpen: state => state.menu.isModalOpen,
      isSearchModalOpen: state => state.menu.isSearchModalOpen,
    }),
    isMobiel() {
      return this.$isMobiel()
    },
  },
  methods: {
    toggleSearchModal() {
      this.$store.commit('TOGGLE_SEARCH_MODAL')
    },
    setWidth() {
      this.$store.commit('SET_INNER_WIDTH', window.innerWidth)
    },
    openModal() {
      this.isSearchModalOpen = true
    },
  },
  data() {
    return {}
  },
  created() {},
  watch: {
    isModalOepn() {
      document.body.classList.toggle('prevent-scroll')
    },
  },
}
</script>
<style lang="scss" scoped>
@import '../../assets/scss/variables';

.container {
  padding-top: 70px;
}
</style>
