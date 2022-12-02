<template>
  <div class="recent-contribution-card">
    <table>
      <tr>
        <td>User</td>
        <td>Record</td>
        <td>Recent</td>
      </tr>
      <tr v-for="i in 5" :key="i">
        <td><ContentsProfile></ContentsProfile></td>
        <td class="record">3 contributions/week</td>
        <td class="recent">0.25</td>
      </tr>
    </table>
  </div>
</template>
<script>
import { headerActivate } from '../../mixin'
import ContentsProfile from '../profile/ContentsProfile.vue'

export default {
  name: 'Table',
  components: {
    ContentsProfile,
  },
  mixins: [headerActivate],
  props: {},
  data() {
    return {}
  },
}
</script>
<style lang="scss" scoped>
@import '../../assets/scss/variables';
.recent-contribution-card {
  height: 425px;
  border: 1px solid #f2f2f2;
  box-shadow: 2px 2px 12px rgba(0, 0, 0, 0.14);
  border-radius: 24px;
  padding: 32px 24px 32px 24px;

  table {
    width: 100%;
    //border-top: 1px solid #444444;
    border-collapse: collapse;
    th,
    td {
      border-bottom: 1px solid #cccccc;
      padding: 21px;
      text-align: left;

      font-family: $item-font;
      font-style: $item-font-style;
      font-weight: 500;
      font-size: 14px;
    }
  }
}

// 화면이 작은 경우 record 부분이 안 보이게
@media (max-width: 360px) {
  .recent-contribution-card > table > tr > td:nth-child(2) {
    display: none;
  }
}
.recent {
  font-family: $item-font;
  font-style: $item-font-style;
  font-weight: 400;
  font-size: 14px;
  color: #333333;
}
</style>
