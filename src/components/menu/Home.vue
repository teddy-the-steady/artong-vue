<template>
  <div>
    <content-list></content-list>
  </div>
</template>

<script>
import { headerActivate } from '../../mixin'
import ContentList from '../contents_v2/ContentList.vue'

export default {
  name: 'Home',
  mixins: [headerActivate],
  components: {
    ContentList
  },
  data() {
    // test commit
    return {}
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/variables';
.container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.content {
    background-color: $artong-white;
    padding: 35px 40px;
    text-align: left;
    display: inline-block;
    border-radius: 10px;
    width: 20%;
    min-width: 50px;
    min-height: 150px;
    margin: 0.5rem;
    box-shadow: 1px 1px 4px 0 rgba(0,0,0,.15);
}
</style>
