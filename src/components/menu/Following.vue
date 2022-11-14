<template>
  <div>
    <h1>Following Contents</h1>
    <content-list></content-list>
  </div>
</template>

<script>
import { headerActivate } from '../../mixin'
import ContentList from '../contents/ContentList.vue'

export default {
  name: 'Following',
  mixins: [headerActivate],
  components: {
    ContentList
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/variables';

h1 {
  color: $artong-black;
}
</style>
