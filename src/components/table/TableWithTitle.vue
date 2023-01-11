<template>
  <div>
    <div class="container">
      <div v-if="showHeader" class="header">
        <img :src="iconSrc" />
        <div>{{ tableName }}</div>
      </div>
      <!-- {{ fields[1] }} -->
      <table class="table">
        <th v-for="(field, i) in fields" :key="i">{{ field.name }}</th>
        <tr v-for="(content, i) in contents" :key="`o-${i}`">
          <td v-for="(field, k) in fields" :key="k">
            <div v-if="field.type == 'price'">
              {{
                content[field.key]
                  ? weiToEther(content[field.key]) + ' ETH'
                  : ''
              }}
            </div>
            <div v-else-if="field.type == 'date'">
              {{ convertDay(parseInt(content[field.key])) }}
              <!-- {{ content[field.key] }} -->
            </div>
            <div v-else-if="field.type == 'member'">
              <ContentsProfile
                :member="content[field.key]"
                :needUserName="true"
              ></ContentsProfile>
            </div>
          </td>
        </tr>
      </table>
      <InfiniteLoading
        @infinite="infiniteHandler"
        spinner="spiral"
      ></InfiniteLoading>
    </div>
  </div>
</template>
<script>
import ContentsProfile from '../profile/ContentsProfile.vue'
import { weiToEther } from '../../util/commonFunc'
import InfiniteLoading from 'vue-infinite-loading'

export default {
  name: 'TableWithTitle',
  components: {
    ContentsProfile,
    InfiniteLoading,
  },
  data() {
    return {
      contents: [],
      noMoreDataToLoad: false,
    }
  },
  props: {
    api: {
      type: Object,
      default: null,
    },
    tableName: {
      type: String,
      default: null,
    },
    iconSrc: {
      type: String,
      default: null,
    },
    showHeader: {
      type: Boolean,
      default: false,
    },
    fields: {
      type: Array,
      default: null,
    },
  },
  methods: {
    weiToEther(wei) {
      return weiToEther(wei)
    },
    convertDay(date) {
      const toDay = new Date()
      const now = toDay.getTime()
      const deadLine = date * 1000
      return Math.ceil((now - deadLine) / (1000 * 3600 * 24)) + 'Day'
    },
    async getContents() {
      const results = await this.api.func(this.api.body)
      this.api.body.variables.skip += this.api.body.variables.first
      return results.offers
    },
    async setContents() {
      const tmp = await this.getContents()
      if (tmp) {
        if (tmp.offers) {
          this.contents = tmp.offers // api가 offers인 경우
        } else {
          this.contents = tmp // api가 history인 경우
        }
      }
      if (this.contents) {
        console.log(this.contents)
      }
    },
    async infiniteHandler($state) {
      console.log('infiniteHandler')
      if (this.noMoreDataToLoad) {
        $state.complete()
        return
      }
      await this.pushData()
      setTimeout(function () {
        $state.loaded()
      }, 1000)
    },
    async pushData() {
      console.log('pushData')
      const contentArrayToPush = await this.makeContentArray()
      if (contentArrayToPush.length > 0) {
        for (let i in contentArrayToPush) {
          this.contents.push(contentArrayToPush[i])
        }
      }
    },
    async makeContentArray() {
      const contentArrayToPush = []
      if (this.api) {
        const result = await this.getContents()
        console.log('!!')
        console.log(result)
        if (result.length > 0) {
          for (let i = 0; i < result.length; i++) {
            contentArrayToPush.push({
              id: result[i].id,
              from: {
                id: result[i].from.id,
                email: result[i].from.email,
                username: result[i].from.username,
                created_at: result[i].from.created_at,
                updated_at: result[i].from.updated_at,
                introduction: result[i].from.introduction,
                profile_s3key: result[i].from.profile_s3key,
                country_id: result[i].from.country_id,
                wallet_address: result[i].from.wallet_address,
                principal_id: result[i].from.principal_id,
                profile_thumbnail_s3key: result[i].from.profile_thumbnail_s3key,
              },
              price: result[i].price,
              deadline: result[i].deadline,
              isAccepted: result[i].isAccepted,
              createdAt: result[i].createdAt,
              updatedAt: result[i].updatedAt,
              sale: {
                id: result[i].sale?.id,
              },
            })
          }
        } else {
          this.noMoreDataToLoad = true
        }
      }
      return contentArrayToPush
    },
  },
  async mounted() {
    //console.log(this.api)
    //await this.setContents()
  },
}
</script>
<style lang="scss" scoped>
@import '../../assets/scss/variables';

.container {
  box-sizing: border-box;
  padding: 32px 16px 0px;
  background: $artong-white;
  width: 100%;
  height: 100%;
  border: 1px solid #f2f2f2;
  box-shadow: 2px 2px 12px rgba(0, 0, 0, 0.14);
  border-radius: 24px;
  .header {
    display: flex;
    font-family: 'Mustica Pro';
    font-style: normal;
    font-weight: 600;
    font-size: 22px;
    color: $artong-black;
    margin-bottom: 33px;
    img {
      width: 24px;
      height: 24px;
      margin-right: 8px;
    }
  }
  table {
    width: 100%;
    text-align: left;
    font-family: 'Pretendard';
    font-style: normal;
    font-size: 14px;
    border-collapse: collapse;
    th {
      height: 41px;
      font-weight: 500;
      text-align: left;
      line-height: 41px;
      border-bottom: 1px solid #cccccc;
    }
    tr {
      td {
        height: 64px;
        font-weight: 400;
        color: #333333;
        border-bottom: 1px solid #cccccc;
      }
    }
    .infinite-loading {
      text-align: center;
    }
  }
}
</style>
