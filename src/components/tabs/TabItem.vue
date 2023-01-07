<template>
  <div
    @click="$emit('tabClick', id)"
    class="tab"
    :class="{ active: isTabActive }"
  >
    {{ label }}
  </div>
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
    //background: $lightgray;
  }
  &.active {
    //background: #f7c9c9;
  }
  font-family: 'Pretendard';
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  color: #808080;
  height: 54px;
  padding: 16px;
  box-sizing: border-box;
  //vertical center alignment
  display: flex;
  align-items: center;
}
.active {
  border-bottom: 2px solid #000000;
  color: #000000;
}
</style>
