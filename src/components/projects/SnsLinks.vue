<template>
  <div>
    <div class="info-top">
      <div class="info-name">Information</div>
      <div class="info-desc" v-if="links">
        {{ links.description }}
      </div>
    </div>
    <div class="sns-btns" v-if="links">
      <div class="btn-container" v-for="(url, name) in links.sns" :key="name">
        <button class="white-btn long-btn" @click="openNewTab(url)">
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
    links: {
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
.info-top {
  .info-name {
    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 600;
    font-size: 18px;

    color: #000000;
  }
  .info-desc {
    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 400;
    font-size: 16px;

    color: #4d4d4d;
  }
}

.sns-btns {
  margin-top: 16px;
  margin-bottom: 299px;
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
