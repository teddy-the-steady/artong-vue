<template>
  <div>
    <div class="sns-btns" v-if="sns">
      <div class="btn-container" v-for="(url, name) in sns" :key="name">
        <button
          v-if="url"
          class="white-button long-btn"
          @click="openNewTab(url)"
        >
          {{ name }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SnsLinks',
  props: {
    sns: {
      type: Object,
      default: () => {},
    },
  },
  methods: {
    openNewTab(url) {
      window.open(url)
    },
  },
}
</script>

<style lang="scss" scoped>
.sns-btns {
  margin: 30px 0;
  .btn-container {
    margin-top: 8px;
    .long-btn {
      width: 100%;
      height: 48px;

      border-radius: 999px;
    }
  }
}
</style>
