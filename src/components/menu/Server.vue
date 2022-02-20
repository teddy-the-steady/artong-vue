<template>
  <div>
    <content-list-v2></content-list-v2>
  </div>
</template>

<script>
import { headerActivate } from '../../mixin'
import ContentListV2 from '../content/ContentListV2'
export default {
  name: 'Server',
  mixins: [headerActivate],
  components: {
    ContentListV2
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
