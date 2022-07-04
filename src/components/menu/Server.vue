<template>
  <div>
    <content-list></content-list>
  </div>
</template>

<script>
import { headerActivate } from '../../mixin'
import ContentList from '../contentsV2/ContentList'
export default {
  name: 'Server',
  mixins: [headerActivate],
  components: {
    ContentList
  },
  data() {
    return {
      info: ''
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/variables';

h1, h2 {
  color: $artong-black;
}
</style>
