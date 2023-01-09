<template>
  <div>
    <div class="round-box">
      <div class="title">
        <img :src="require('@/assets/icons/100-add-folder.svg')" /> Offers
      </div>
      <table>
        <tr>
          <td>PRICE</td>
          <td>DATE</td>
          <td>FROM</td>
        </tr>
        <tr v-for="(val, i) in offers" :key="i">
          <td class="price">
            {{ weiToEther(val.price) }}
            ETH
            <img
              :src="require('@/assets/icons/launch.svg')"
              @click="action('price')"
            />
          </td>
          <td class="record">
            {{ convertDay(val.createdAt) }}
          </td>
          <td class="recent">
            <ContentsProfile
              :member="val.from"
              :needUserName="true"
            ></ContentsProfile>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>
<script></script>
<style lang="scss" scoped>
@import '../../assets/scss/variables';
.round-box {
  &.history {
    margin-top: 3rem;
  }
  //min-height: 425px;
  max-width: 90%;
  border: 1px solid #f2f2f2;
  box-shadow: 2px 2px 12px rgba(0, 0, 0, 0.14);
  border-radius: 24px;
  padding: 32px 24px 32px 24px;

  .title {
    text-align: initial;
    margin-left: 1rem;
    font-size: 22px;
    font-weight: 600;
    img {
      max-width: 1.8rem;
      vertical-align: text-top;
    }
  }

  table {
    width: 100%;
    //border-top: 1px solid #444444;
    border-collapse: collapse;
    th {
      font-weight: 50;
    }

    td {
      border-bottom: 1px solid #cccccc;
      padding: 21px;
      text-align: left;

      font-family: $item-font;
      font-style: $item-font-style;
      font-weight: 500;
      font-size: 14px;

      &.price {
        img {
          margin-left: 0.5rem;
          cursor: pointer;
          opacity: 0.5;
          vertical-align: middle;
        }
      }
    }
  }
}
</style>
