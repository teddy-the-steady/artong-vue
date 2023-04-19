<template>
  <div
    @click="$emit('tabClick', id)"
    class="tab"
    :class="{ active: isTabActive }"
  >
    {{ label }}
    <span
      v-if="id === 0"
      class="count"
      :class="{ nonZero: parseInt(project.token_count) > 0 }"
    >
      {{ parseInt(project.token_count) > 0 ? project.token_count : '' }}
    </span>
    <span
      v-if="id === 3"
      class="count"
      :class="{ nonZero: parseInt(project.tokens_tobe_approved_count) > 0 }"
    >
      {{
        parseInt(project.tokens_tobe_approved_count) > 0
          ? project.tokens_tobe_approved_count
          : ''
      }}
    </span>
  </div>
</template>

<script>
export default {
  name: 'ProjectTabItem',
  props: {
    id: Number,
    label: String,
    value: Number,
    project: {
      type: Object,
      default: () => {},
    },
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

  .count {
    &.nonZero {
      margin-left: 10px;
      font-size: 14px;
    }
  }
}
.active {
  border-bottom: 2px solid #000000;
  color: #000000;
}
</style>
