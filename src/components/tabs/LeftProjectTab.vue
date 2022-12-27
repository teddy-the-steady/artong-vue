<template>
  <div>
    <div class="box">
      <div class="red-button">Art</div>
      <div class="collection-name">Collection name</div>
      <ContentsProfile class="contents-profile" />
      <div class="buttons1">
        <button class="white-btn">Subscribe</button>
        <button class="contribute-btn">Contribute</button>
      </div>
      <div class="detail">
        <div class="top">Items</div>
        <div class="bottom">325/1000</div>
        <div class="top">Subscriber</div>
        <div class="bottom">2,000</div>
        <div class="top">Floor price</div>
        <div class="bottom">0,001 ETH</div>
        <div class="top">Total sales</div>
        <div class="bottom">12K ETH</div>
      </div>
      <div class="buttons2">
        <button class="wide-btn">Instagram</button>
        <button class="wide-btn">twitter</button>
        <button class="wide-btn">discord</button>
        <button class="wide-btn">website</button>
      </div>
      <div class="info">
        <div class="info-title">Information</div>
        <div class="info-description">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ac sit lorem
          vel magna id. Enim feugiat felis at ultrices a dolor amet, tincidunt
          in. Cursus volutpat convallis turpis elementum. Fusce morbi sit diam
          arcu.
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import ContentsProfile from '../profile/ContentsProfile.vue'

export default {
  name: 'LeftProjectTab',
  components: {
    ContentsProfile,
  },
}
</script>
<style lang="scss" scoped>
@import '../../assets/scss/variables';
.box {
  box-sizing: border-box;
  padding: 32px 24px;
  gap: 32px;
  width: 346px;
  height: 1012px;
  background: #ffffff;
  border: 1px solid #cccccc;
  border-radius: 8px;
  .red-button {
    width: 52px;
    height: 25px;
    border: 1px solid #f22e3e;
    border-radius: 999px;
    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    color: #f22e3e;
    line-height: 25px;
  }
  .collection-name {
    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 700;
    font-size: 24px;
    color: #000000;
    text-align: left;
    margin-top: 8px;
  }
  .contents-profile {
    margin-top: 8px;
  }
  .buttons1 {
    display: flex;
    flex-direction: row;
    margin-top: 32px;
    .subscribe-btn {
      width: 141px;
      height: 48px;

      margin-right: 16px;
    }
    .contribute-btn {
      width: 141px;
      height: 48px;
      background: #000000;
      border-radius: 5px;

      font-family: 'Pretendard';
      font-style: normal;
      font-weight: 500;
      font-size: 14px;
      color: #ffffff;
    }
  }
  .detail {
    font-family: 'Pretendard';
    font-style: normal;
    font-size: 18px;
    text-align: left;
    margin-top: 32px;
    margin-bottom: 32px;
    .top {
      font-weight: 600;
      color: #000000;
      margin-bottom: 8px;
    }
    .bottom {
      font-weight: 400px;
      color: #4d4d4d;
      margin-bottom: 24px;
    }
  }
  .buttons2 {
    margin-bottom: 32px;
    .wide-btn {
      width: 298px;
      height: 48px;
      background: #ffffff;
      border: 1px solid #000000;
      border-radius: 999px;

      font-family: 'Pretendard';
      font-style: normal;
      font-weight: 500;
      font-size: 14px;
      color: #000000;

      margin-bottom: 8px;
      //
      transition: background-color 0.2s, color 0.2s, border-color 0.2s,
        box-shadow 0.2s;
    }
  }
  .info {
    text-align: left;
    .info-title {
      font-family: 'Pretendard';
      font-style: normal;
      font-weight: 600;
      font-size: 18px;
      color: #000000;
      margin-bottom: 8px;
    }
    .info-description {
      font-family: 'Pretendard';
      font-style: normal;
      font-weight: 400;
      font-size: 16px;
      color: #4d4d4d;
      line-height: 150%;
    }
  }
}
</style>
