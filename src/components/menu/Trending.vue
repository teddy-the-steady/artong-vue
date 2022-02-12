<template>
  <div>
    <h1>Trending Contents</h1>
    <content-list></content-list>
  </div>
</template>

<script>
import ContentList from '../content/ContentList'
import { headerActivate } from '../../mixin'
export default {
  name: 'Trending',
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
