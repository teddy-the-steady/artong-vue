<template>
  <div>
    <button @click="printResult"></button>
  </div>
</template>
<script>
//import ContentsProfile from '../profile/ContentsProfile.vue'

export default {
  name: 'TableWithTitle',
  components: {
    //ContentsProfile,
  },
  props: {
    api: {
      type: Object,
      default: null,
    },
  },
  methods: {
    async getContents() {
      const results = await this.api.func(this.api.body)
      return results // offers가 들어있음
    },
    async printResult() {
      const tmp = await this.getContents()
      console.log(tmp)
    },
  },
  mounted() {},
}
</script>
<style lang="scss" scoped>
@import '../../assets/scss/variables';
</style>
