<template>
  <div>
    <h1>Welcome to Workplace</h1>
  </div>
</template>

<script>
import { menuMixin } from '../../mixin'
export default {
  name: 'Workplace',
  mixins: [menuMixin]
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/variables';

h1 {
  color: $artong-black;
}
</style>
