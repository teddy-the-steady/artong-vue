<template>
  <div class="wrapper">
    <div class="top">
      <img class="delete-btn" src="../../assets/icons/delete.svg" />
    </div>
    <div class="title">Project Info</div>
    <div class="container1" v-for="(item, index) in data1" :key="index">
      <div class="name">{{ item.name }}</div>
      <div class="info">{{ item.info }}</div>
    </div>
    <div class="container2">
      <div class="btn-container" v-for="(item, index) in data2" :key="index">
        <button class="white-btn long-btn" @click="move">
          {{ item.name }}
        </button>
      </div>
    </div>
    <div class="container3">
      <button class="white-btn subscribe">Subscribe</button>
      <button class="contribute">Contribute</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProjectInfo',
  components: {},
  data() {
    return {
      data1: [
        { name: 'Items', info: '235/1000' },
        { name: 'Subscirber', info: '2,000' },
        { name: 'Floor price', info: '0.001 ETH' },
        { name: 'Total sales', info: '12K ETH' },
      ],
      data2: [
        { name: 'Instagram', link: 'data.project.sns.twitter' },
        { name: 'twitter', link: 'https://www.naver.com/' },
        { name: 'discord', link: 'https://naver.com' },
        { name: 'website', link: 'https://naver.com' },
      ],
    }
  },
  methods: {
    move() {
      window.open(this.data2.link)
    },
  },
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/variables';

.wrapper {
  padding-left: 16px;
  padding-right: 16px;

  .top {
    text-align: initial;
    display: flex;
    .logo {
      width: 111.33px;
      height: 20px;
      margin-top: 30px;
    }
    .delete-btn {
      margin-top: 16px;
      margin-left: auto;
      margin-bottom: 16px;
      width: 48px;
      height: 48px;
    }
  }
  .title {
    justify-content: center;
    border-bottom: 1px solid #e5e5e5;
    height: 61px;
    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 700;
    font-size: 24px;
    line-height: 29px;
    color: $artong-black;
    line-height: 61px;
    // 선의 너비가 화먼 너비와 같게
    width: 100vw;
    margin-left: -16px;
    margin-right: -16px;
  }
  .container1 {
    text-align: initial;
    margin-top: 16px;
    margin-bottom: 8px;
    .name {
      font-family: 'Pretendard';
      font-style: normal;
      font-weight: 600;
      font-size: 18px;
      color: $artong-black;
      margin-bottom: 8px;
    }
    .info {
      font-family: 'Pretendard';
      font-style: normal;
      font-weight: 400;
      font-size: 16px;
      color: #4d4d4d;
    }
  }
  .container2 {
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
  .container3 {
    display: flex;
    height: 72px;
    width: 100vw;
    margin-left: -16px;
    margin-right: -16px;
    border-top: 1px solid #e5e5e5;
    justify-content: space-evenly;
    padding-top: 24px;
    .subscribe {
      width: 46vw;
      height: 48px;
    }
    .contribute {
      width: 46vw;
      height: 48px;
    }
  }
}
</style>
