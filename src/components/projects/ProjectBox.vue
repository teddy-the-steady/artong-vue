<template>
  <div class="box">
    {{project}}
  </div>
</template>

<script>
export default {
  name: 'ProjectBox',
  props: {
    project: {
      type: Object,
      default: null
    }
  },
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/variables';

.box {
  display: block;
  height: 300px;
  margin: 10px;
  box-shadow: 1px 1px 4px 0 rgb(0 0 0 / 15%);
}
</style>