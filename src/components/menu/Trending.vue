<template>
  <div>
    <project-list></project-list>
  </div>
</template>

<script>
import ProjectList from '../projects/ProjectList'
import { headerActivate } from '../../mixin'
export default {
  name: 'Trending',
  mixins: [headerActivate],
  components: {
    ProjectList
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/variables';

h1 {
  color: $artong-black;
}
</style>
