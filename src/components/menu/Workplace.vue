<template>
  <div>
    <h1>Welcome to Workplace</h1>
  </div>
</template>

<script>
import { headerActivate } from '../../mixin'
export default {
  name: 'Workplace',
  mixins: [headerActivate]
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/variables';

h1 {
  color: $artong-black;
}
</style>
