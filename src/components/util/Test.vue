<template>
  <div class="container">
    This is a test
    <button @click="toggleSearchModal">click here to open modal</button>
    <SearchModal
      :isSearchModalOpen="isSearchModalOpen"
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
  data() {
    return {
      isSearchModalOpen: false,
    }
  },
  computed: {
    ...mapState({
      isModalOpen: state => state.menu.isModalOpen,
    }),
    isMobiel() {
      return this.$isMobiel()
    },
  },
  methods: {
    toggleSearchModal() {
      this.isSearchModalOpen = !this.isSearchModalOpen
    },
    setWidth() {
      this.$store.commit('SET_INNER_WIDTH', window.innerWidth)
    },
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
