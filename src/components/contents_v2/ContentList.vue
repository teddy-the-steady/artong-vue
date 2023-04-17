<template>
  <div class="contents">
    <masonry :cols="windowWide ? colsWide : cols">
      <div class="content" v-for="(val, i) in contentList" :key="i">
        <ContentBox
          :image="val"
          @click.native="onContentClick($event, val)"
        ></ContentBox>
        <router-link
          class="profileBox"
          :to="{
            name: 'UserOrArtist',
            params: {
              id: val.owner ? val.owner.username : val.creator.username,
              wallet_address: val.owner
                ? val.owner.wallet_address
                : val.creator.wallet_address,
            },
          }"
        >
          <ContentsProfile
            :member="val.owner || val.creator"
            :price="val.price"
          ></ContentsProfile>
        </router-link>
      </div>
    </masonry>
    <InfiniteLoading
      :identifier="$route.path"
      @infinite="infiniteHandler"
      spinner="spiral"
      force-use-infinite-wrapper="body"
    ></InfiniteLoading>
  </div>
</template>

<script>
import InfiniteLoading from 'vue-infinite-loading'
import { makeS3Path, weiToEther } from '../../util/commonFunc'
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
    windowWide: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      contentList: [],
      noMoreDataToLoad: false,
      colsWide: {
        default: 7,
        1500: 6,
        1300: 5,
        1100: 4,
        850: 3,
        570: 2,
        310: 1,
      },
      cols: {
        default: 6,
        2000: 5,
        1700: 4,
        1000: 3,
        570: 2,
        310: 1,
      },
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
      }, 100)
    },
    async pushData() {
      let contentArrayToPush = []
      if (!this.queryContents.func) {
        return
      }

      // INFO] graphql.length === 1, RESTapi.length === 2
      if (this.queryContents.func.length === 1) {
        const results = await this.gqlContents()

        if (this.queryContents.body.variables.start_num >= 0) {
          // INFO] case like queryTokensByProject: subgraph + db
          this.queryContents.body.variables.skip += results.meta.subgraph_count
          this.queryContents.body.variables.start_num +=
            this.queryContents.body.variables.first
        } else {
          this.queryContents.body.variables.skip +=
            this.queryContents.body.variables.first
        }
        contentArrayToPush = await this.makeContentArray(
          results.data.tokens,
          results.meta,
        )
      } else {
        const results = await this.getContents()
        this.queryContents.queryParams.start_num +=
          this.queryContents.queryParams.count_num
        contentArrayToPush = await this.makeContentArray(
          results.data,
          results.meta,
        )
      }

      if (contentArrayToPush.length > 0) {
        for (let i in contentArrayToPush) {
          this.contentList.push(contentArrayToPush[i])
        }
      }
    },
    async makeContentArray(apiResults, meta) {
      const contentArrayToPush = []

      if (apiResults.length > 0) {
        for (let i = 0; i < apiResults.length; i++) {
          contentArrayToPush.push({
            id: apiResults[i].id,
            tokenId: apiResults[i].tokenId,
            token_id: apiResults[i].token_id,
            projectAddress:
              apiResults[i].project?.id || apiResults[i].project_address,
            slug: apiResults[i].slug,
            tokenURI: apiResults[i].tokenURI,
            contentURI: apiResults[i].contentURI,
            creator: apiResults[i].creator,
            owner: apiResults[i].owner,
            content_s3key: makeS3Path(apiResults[i].content_s3key),
            content_thumbnail_s3key: makeS3Path(
              apiResults[i].content_thumbnail_s3key,
            ),
            price: this.extractPrice(apiResults[i]),
            createdAt: apiResults[i].createdAt,
            updatedAt: apiResults[i].updatedAt,
          })
        }
      }

      if (!meta.hasMoreData) {
        this.noMoreDataToLoad = true
      }

      return contentArrayToPush
    },
    async gqlContents() {
      const results = await this.queryContents.func(this.queryContents.body)
      return results
    },
    async getContents() {
      const results = await this.queryContents.func(
        this.queryContents.pathParams,
        this.queryContents.queryParams,
      )
      return results
    },
    onContentClick(event, val) {
      if (val.token_id || val.tokenId) {
        this.$router.push({
          name: 'ContentDetail',
          params: {
            project_address: val.slug || val.projectAddress,
            token_id: val.token_id || val.tokenId,
            image_width: event.target.naturalWidth,
            image_height: event.target.naturalHeight,
          },
        })
      } else if (val.id) {
        this.$router.push({
          name: 'ContentCandidateDetail',
          params: {
            project_address: val.slug || val.projectAddress,
            contents_id: val.id,
            image_width: event.target.naturalWidth,
            image_height: event.target.naturalHeight,
          },
        })
      }
    },
    extractPrice(result) {
      if (result.listings && result.listings.length > 0) {
        const listing = result.listings[0]
        if (['LISTED', 'UPDATED'].includes(listing.eventType)) {
          return weiToEther(listing.price)
        }
        return null
      } else if (result.price) {
        if (result.token_id > 0) {
          return null
        } else {
          return weiToEther(parseInt(result.price).toString())
        }
      }
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
