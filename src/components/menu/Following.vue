<template>
  <div>
    <h1>Following Contents</h1>
    <content-list></content-list>
  </div>
</template>

<script>
import ContentList from '../content/ContentList'
import { headerActivate } from '../../mixin'
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
