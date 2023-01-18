<template>
  <div>
    <div class="container">
      <div v-if="showHeader" class="header">
        <img :src="iconSrc" />
        <div>{{ tableName }}</div>
      </div>
      <div class="table">
        <div class="top-row">
          <div v-for="(field, i) in fields" :key="i" class="field">
            {{ field.name }}
          </div>
        </div>
        <div class="middle-box">
          <div
            class="middle-row"
            v-for="(content, i) in contents"
            :key="`o-${i}`"
          >
            <div v-for="(field, k) in fields" :key="k">
              <div class="field" v-if="field.type == 'price'">
                {{
                  content[field.key]
                    ? weiToEther(content[field.key]) + ' ETH'
                    : ''
                }}
              </div>
              <div class="field" v-else-if="field.type == 'date'">
                {{ convertDay(parseInt(content[field.key])) }}
                <!-- {{ content[field.key] }} -->
              </div>
              <div class="field" v-else-if="field.type == 'member'">
                <ContentsProfile
                  :member="content[field.key]"
                  :needUserName="true"
                ></ContentsProfile>
              </div>
            </div>
          </div>
          <InfiniteLoading
            @infinite="infiniteHandler"
            spinner="spiral"
            class="infinite-loading"
          ></InfiniteLoading>
        </div>
      </div>
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
      if (this.api.result_key == 'offers') {
        this.api.body.variables.skip += this.api.body.variables.first
        return results.offers
      } else if (this.api.result_key == 'history') {
        this.api.body.pagination.start_num += this.api.body.pagination.count_num
        return results
      }
    },
    async infiniteHandler($state) {
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
        if (result.length > 0) {
          for (let i = 0; i < result.length; i++) {
            contentArrayToPush.push(result[i])
          }
        } else {
          this.noMoreDataToLoad = true
        }
      }
      return contentArrayToPush
    },
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
    // position: absolute;
    // background-color: $artong-white;
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
  .table {
    width: 100%;
    overflow-y: auto;

    .top-row {
      display: inline-flex;
      justify-content: space-between;
      height: 41px;
      border-bottom: 1px solid #cccccc;
      line-height: 41px;
      min-width: 100%;
      position: sticky;
      top: 0;
      background-color: $artong-white;

      .field {
        width: 100%;
        min-width: 174px;
        text-align: left;
        font-family: 'Pretendard';
        font-style: normal;
        font-weight: 500;
        font-size: 14px;
        color: $artong-black;
        padding-left: 8px;
      }
    }
    .middle-box {
      min-height: 39px;
      max-height: 299px;
      .middle-row {
        height: 64px;
        line-height: 64px;
        display: inline-flex;
        justify-content: space-between;
        border-bottom: 1px solid #cccccc;
        min-width: 100%;
        div {
          margin-top: 100%;
          width: 182px;
          padding-top: auto;
          padding-bottom: auto;
          line-height: inherits;
          margin: auto;
          .field {
            width: 100%;
            text-align: left;
            font-family: 'Pretendard';
            font-style: normal;
            font-weight: 400;
            font-size: 14px;
            padding-left: 8px;
            color: #333333;
          }
        }
      }
    }
  }
}
</style>
