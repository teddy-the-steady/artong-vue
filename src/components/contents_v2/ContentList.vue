<template>
  <div class="contents">
    <masonry
      :cols="{ default: 7, 1500: 6, 1300: 5, 1100: 4, 850: 3, 570: 2, 310: 1 }"
    >
      <div class="content" v-for="(val, i) in contentList" :key="i">
        <router-link
          :to="{
            name: 'ContentDetail',
            params: {
              project_address: val.projectAddress,
              token_id: val.tokenId,
            },
          }"
        >
          <content-box :image="val"></content-box>
        </router-link>
        <router-link
          class="profileBox"
          :to="{
            name: 'UserOrArtist',
            params: {
              id: val.owner.username,
              wallet_address: val.owner.wallet_address,
            },
          }"
        >
          <contents-profile :member="val.owner"></contents-profile>
        </router-link>
      </div>
    </masonry>
    <infinite-loading
      :identifier="$route.params.id"
      @infinite="infiniteHandler"
      spinner="spiral"
      force-use-infinite-wrapper=".contents"
    ></infinite-loading>
  </div>
</template>

<script>
import InfiniteLoading from 'vue-infinite-loading'
import { makeS3Path } from '../../util/commonFunc'
import ContentBox from './ContentBox.vue'
import ContentsProfile from '../profile/ContentsProfile.vue'

export default {
  name: 'ContentList',
  components: {
    ContentBox,
    ContentsProfile,
    InfiniteLoading,
  },
  props: {
    queryContents: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      contentList: [],
      noMoreDataToLoad: false,
    }
  },
  methods: {
    async infiniteHandler($state) {
      if (this.noMoreDataToLoad) {
        $state.complete()
        return
      }
      await this.pushData()
      setTimeout(function () {
        $state.loaded()
      }, 500)
    },
    async pushData() {
      let contentArrayToPush = []
      if (!this.queryContents.func) {
        return
      }

      if (typeof this.queryContents.func === 'function') {
        if (this.queryContents.func.name === 'graphql') {
          const results = await this.gqlContents()
          this.queryContents.body.variables.skip +=
            this.queryContents.body.variables.first
          contentArrayToPush = await this.makeContentArray(results)
        } else {
          const results = await this.getContents()
          this.queryContents.queryParams.start_num +=
            this.queryContents.queryParams.count_num
          contentArrayToPush = await this.makeContentArray(results)
        }
      } else if (this.queryContents.func.length > 1) {
        // TODO] graphql + 일반 api call
      }

      if (contentArrayToPush.length > 0) {
        for (let i in contentArrayToPush) {
          this.contentList.push(contentArrayToPush[i])
        }
      }
    },
    async makeContentArray(apiResults) {
      const contentArrayToPush = []

      if (apiResults.length > 0) {
        for (let i = 0; i < apiResults.length; i++) {
          contentArrayToPush.push({
            id: apiResults[i].id,
            tokenId: apiResults[i].tokenId,
            projectAddress: apiResults[i].project?.id,
            tokenURI: apiResults[i].tokenURI,
            contentURI: apiResults[i].contentURI,
            creator: apiResults[i].creator,
            owner: apiResults[i].owner,
            content_s3key: makeS3Path(apiResults[i].content_s3key),
            content_thumbnail_s3key: makeS3Path(
              apiResults[i].content_thumbnail_s3key,
            ),
            createdAt: apiResults[i].createdAt,
            updatedAt: apiResults[i].updatedAt,
          })
        }
      } else {
        this.noMoreDataToLoad = true
      }

      return contentArrayToPush
    },
    async gqlContents() {
      const results = await this.queryContents.func(this.queryContents.body)
      return results.tokens
    },
    async getContents() {
      const results = await this.queryContents.func(
        this.queryContents.pathParams,
        this.queryContents.queryParams,
      )
      return results
    },
  },
  watch: {
    queryContents: {
      async handler(val) {
        this.noMoreDataToLoad = false
        this.contentList = []
        this.queryContents = val
      },
    },
  },
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/variables';

.contents {
  margin-top: 10px;
}

.profileBox {
  display: block;
  height: 30px;
  padding: 10px;
}
</style>
