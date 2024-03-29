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
            <div>
              {{ field.name }}
            </div>
          </div>
          <div class="accept-button-header"></div>
        </div>
        <div class="middle-box">
          <div
            class="middle-row"
            v-for="(content, i) in contents"
            :key="`o-${i}`"
            :style="{
              'border-bottom':
                i === contents.length - 1 ? 'solid 1px #cccccc' : 'none',
            }"
          >
            <div v-for="(field, k) in fields" :key="k">
              <div class="field" v-if="field.type == 'event'">
                {{ content[field.key] }}
              </div>
              <div
                class="field"
                v-else-if="field.type == 'price'"
                @click="
                  tableName == $t('views.content-detail.table.offers.title')
                    ? toEtherscan(content.txHash)
                    : toEtherscan(content.tx_hash)
                "
              >
                {{
                  content[field.key]
                    ? weiToEther(content[field.key]) + ' ETH'
                    : ''
                }}
                <img src="../../assets/icons/launch-grey.svg" />
              </div>
              <div class="field" v-else-if="field.type == 'date'">
                {{ convertDay(parseInt(content[field.key])) }}
              </div>
              <CountDownTimer
                class="field"
                v-else-if="field.type == 'countdown'"
                :endDate="new Date(content[field.key] * 1000)"
                :isAccepted="content.isAccepted"
                :isFirstLoading="true"
              />
              <div class="field" v-else-if="field.type == 'member'">
                <div v-if="!content[field.key]">
                  <ContentsProfile
                    :member="content[field.key]"
                    :needUserName="true"
                  ></ContentsProfile>
                </div>
                <router-link
                  v-else
                  :to="{
                    name: 'UserOrArtist',
                    params: {
                      id: content[field.key] ? content[field.key].username : '',
                    },
                  }"
                >
                  <ContentsProfile
                    :member="content[field.key]"
                    :needUserName="true"
                  ></ContentsProfile>
                </router-link>
              </div>
            </div>
            <div
              v-if="
                tableName === $t('views.content-detail.table.offers.title') &&
                new Date(content.deadline * 1000) > new Date() &&
                isCurrentUserTokenOwner &&
                !content.isAccepted
              "
              class="accept-button"
            >
              <button @click="accept(content.from.wallet_address)">
                <span class="spinner" :class="{ active: accepting }"></span>
                <span v-show="!accepting">{{
                  $t('views.content-detail.buttons.accept')
                }}</span>
              </button>
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
import InfiniteLoading from 'vue-infinite-loading'
import { weiToEther } from '../../util/commonFunc'
import ContentsProfile from '../profile/ContentsProfile.vue'
import CountDownTimer from '../util/CountDownTimer.vue'

export default {
  name: 'TableDiv',
  components: {
    ContentsProfile,
    InfiniteLoading,
    CountDownTimer,
  },
  data() {
    return {
      contents: [],
      noMoreDataToLoad: false,
      now: new Date(),
      borderBottom: '1px solid #cccccc',
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
    isCurrentUserTokenOwner: {
      type: Boolean,
      default: false,
    },
    accepting: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    accept(offeror_address) {
      this.$emit('accept', offeror_address)
    },
    toEtherscan(tx) {
      if (process.env.NODE_ENV == 'production') {
        window.open('https://etherscan.io/tx/' + tx)
      } else {
        window.open('https://goerli.etherscan.io/tx/' + tx)
      }
    },
    weiToEther(wei) {
      return weiToEther(wei)
    },
    convertDay(date) {
      const toDay = new Date()
      const now = toDay.getTime()
      const deadLine = date * 1000
      const result = Math.ceil((now - deadLine) / (1000 * 3600 * 24))
      if (result > 1) {
        return result + 'Days'
      } else {
        return result + 'Day'
      }
    },
    async getContents() {
      const results = await this.api.func(this.api.body)

      if (this.api.result_key == 'offers') {
        this.api.body.variables.skip += this.api.body.variables.first
      } else if (this.api.result_key == 'history') {
        this.api.body.pagination.start_num += this.api.body.pagination.count_num
      }

      return results
    },
    async infiniteHandler($state) {
      if (this.noMoreDataToLoad || !this.api) {
        $state.complete()
        return
      }
      await this.pushData()
      setTimeout(function () {
        $state.loaded()
      }, 100)
    },
    async pushData() {
      if (this.api) {
        const results = await this.getContents()

        let contentArrayToPush = []
        if (this.api.result_key == 'offers') {
          contentArrayToPush = await this.makeContentArray(
            results.data.offers,
            results.meta,
          )
        } else if (this.api.result_key == 'history') {
          contentArrayToPush = await this.makeContentArray(
            results.data,
            results.meta,
          )
        }
        if (contentArrayToPush.length > 0) {
          for (let i in contentArrayToPush) {
            this.contents.push(contentArrayToPush[i])
          }
        }
      }
    },
    async makeContentArray(apiResults, meta) {
      const contentArrayToPush = []
      if (apiResults.length > 0) {
        for (let i = 0; i < apiResults.length; i++) {
          contentArrayToPush.push(apiResults[i])
        }
      }

      if (!meta.hasMoreData) {
        this.noMoreDataToLoad = true
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
      //border-bottom: 1px solid #cccccc;
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
        border-top: 1px solid #cccccc;
        min-width: 100%;
        div {
          margin-top: 100%;
          width: 182px;
          padding-top: auto;
          padding-bottom: auto;
          line-height: inherits;
          margin: auto auto auto 0;
          .field {
            width: 100%;
            text-align: left;
            font-family: 'Pretendard';
            font-style: normal;
            font-weight: 400;
            font-size: 14px;
            padding-left: 8px;
            color: #333333;
            img {
              transform: translateY(6px);
            }
          }
        }
        .accept-button {
          position: sticky;
          right: 0;
          display: flex;
          justify-content: flex-end;

          & > span:nth-child(2) {
            align-self: center;
          }
        }
      }
    }
  }
  .accept-button-header {
    width: 100%;
  }
}
</style>
