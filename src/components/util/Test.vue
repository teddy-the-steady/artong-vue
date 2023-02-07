<template>
  <div class="container">
    This is a test
    <Info class="info" :words="words"></Info>
  </div>
</template>
<script>
import Info from '../util/Info.vue'
export default {
  name: 'Test',
  components: {
    Info,
  },
  data() {
    return {
      words: 'hi this is captain speaking',
    }
  },
  methods: {},
}
</script>
<style lang="scss" scoped>
@import '../../assets/scss/variables';

.container {
  //padding-top: 70px;
  margin-left: auto;
  margin-right: auto;
  .info {
  }
}
</style>
