<template>
  <span
    @click="$emit('tabClick', id)"
    class="tab"
    :class="{ active: isTabActive }"
  >
    {{ label }}
  </span>
</template>

<script>
export default {
  name: 'TabItem',
  props: {
    id: Number,
    label: String,
    value: Number,
  },
  computed: {
    isTabActive() {
      return this.value === this.id ? true : false
    },
  },
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/variables';

.tab {
  cursor: pointer;
  &:hover {
    background: $lightgray;
  }
  &.active {
    background: #f7c9c9;
  }
}
</style>
