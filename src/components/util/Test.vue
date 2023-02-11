<template>
  <div class="container">
    This is a test
    <div class="box">click outside of this box</div>
  </div>
</template>
<script>
import { mapState } from 'vuex'

export default {
  name: 'Test',
  components: {},
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
    print() {
      console.log('clicked outside')
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
  .box {
    width: 100%;
    height: 30px;
    background-color: red;
  }
}
</style>
