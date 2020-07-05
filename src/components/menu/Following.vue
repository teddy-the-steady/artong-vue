<template>
  <div>
    <h1>Following Contents</h1>
    <content-list></content-list>
  </div>
</template>

<script>
import ContentList from '../content/ContentList'
import { menuMixin } from '../../mixin'
export default {
  name: 'Following',
  mixins: [menuMixin],
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
