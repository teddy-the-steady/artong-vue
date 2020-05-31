<template>
  <div>
    <h1>Following Contents</h1>
    <contents-list></contents-list>
  </div>
</template>

<script>
import ContentsList from '../content/ContentsList'
export default {
  name: 'Following',
  components: {
    ContentsList
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/variables';

h1 {
  color: $artong-black;
}
</style>
