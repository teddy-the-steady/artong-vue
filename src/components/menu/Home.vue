<template>
  <div>
    <content-list-v2 class="list"></content-list-v2>
  </div>
</template>

<script>
import ContentListV2 from '../content/ContentListV2'
import { headerActivate } from '../../mixin'
export default {
  name: 'Home',
  mixins: [headerActivate],
  components: {
    ContentListV2
  },
  data() {
    return {}
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/variables';
.list {
  height: 100%;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}
</style>
