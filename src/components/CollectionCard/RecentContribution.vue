<template>
  <carousel
    :perPageCustom="[
      [360, 1],
      [400, 1.2],
      [500, 1.5],
      [600, 1.8],
      [700, 2],
      [840, 2.2],
      [1080, 2.9],
      [1440, 3.9],
      [1920, 4],
    ]"
    :autoplay="true"
    :autoplayHoverPause="true"
    :loop="true"
    :scrollPerPage="true"
    paginationColor="#B3B3B3"
    paginationActiveColor="#000000"
  >
    <slide v-for="i in testNumber" :key="i">
      <div class="wrapper">
        <div class="top"></div>
        <div class="bottom">
          <ContentsProfile class="content-profile"></ContentsProfile>
          <div class="price-title">현재 입찰가</div>
          <div class="price">0.25 ETH</div>
        </div>
      </div>
    </slide>
  </carousel>
</template>
<script>
import ContentsProfile from '../profile/ContentsProfile.vue'

export default {
  name: 'CuratedCollection',
  components: {
    ContentsProfile,
  },
  data() {
    return {
      needprojectname: true,
      testNumber: 5, // for문을 돌리기 위해 임의로 collection card 수를 잡음
    }
  },
  // methods: {
  //     handleSlideClick(dataset)=>{
  //         console.log(dataset.index, dataset.name)
  //     }
  // }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/variables';

.wrapper {
  border: 1px solid #333333;
  border-radius: 15px;
  margin: 24px 16px;
  height: 453px;

  .top {
    background-image: url(../../assets/images/art11.jpg);
    height: 330px;
    border-top-left-radius: 15px;
    border-top-right-radius: 15px;
  }

  .bottom {
    display: flex;
    flex-direction: column;
    margin: 16px 0;
    height: 32px;
    .content-profile {
      margin-left: 16px;
    }
    .price-title {
      margin-top: 16px;
      margin-left: 16px;
      text-align: left;
      font-family: $item-font;
      font-style: $item-font-style;
      font-weight: 500;
      font-size: 14px;
      color: #808080;
    }
    .price {
      margin-top: 4px;
      margin-left: 16px;
      text-align: left;
      font-family: $item-font;
      font-style: $item-font-style;
      font-weight: 500;
      font-size: 18px;
      color: $artong-black;
    }
  }
}
</style>
