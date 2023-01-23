<template>
  <div class="container">
    This is a test
    <TokenProfile></TokenProfile>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import TokenProfile from '../profile/TokenProfile.vue'

export default {
  name: 'Test',
  components: {
    TokenProfile,
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
