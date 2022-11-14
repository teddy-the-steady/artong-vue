<template>
  <div class="contents">
    <masonry :cols="{default: 7, 1500:6, 1300: 5, 1100: 4, 850: 3, 570: 2, 310: 1}">
      <div class="content" v-for="(val, i) in contentList" :key="i">
        <router-link :to="{ name: 'Content', params: {
          project_address: val.projectAddress,
          token_id: val.tokenId
        }}">
          <content-box :image="val"></content-box>
        </router-link>
        <router-link class="profileBox" :to="{ name: 'UserOrArtist', params: { id: val.owner.username }}">
          <contents-profile :member="val.owner"></contents-profile>
        </router-link>
      </div>
    </masonry>
    <infinite-loading :identifier="$route.params.id" @infinite="infiniteHandler" spinner="spiral"></infinite-loading>
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
    ContentBox, ContentsProfile, InfiniteLoading
  },
  props: {
    queryContents: {
      type: Object,
      default: () => {}
    }
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
      setTimeout(function() { $state.loaded() }, 1000)
    },
    async pushData() {
      const contentArrayToPush = await this.makeContentArray()
      if (contentArrayToPush.length > 0) {
        for (let i in contentArrayToPush) {
          this.contentList.push(contentArrayToPush[i])
        }
      }
    },
    async makeContentArray() {
      const contentArrayToPush = []
      if (this.queryContents) {
        let results = null
        results = await this.getContents(this.queryContents)
        this.queryContents.body.variables.skip += this.queryContents.body.variables.first

        if (results.length > 0) {
          for (let i = 0; i < results.length; i++) {
            contentArrayToPush.push({
              id: results[i].id,
              tokenId: results[i].tokenId,
              projectAddress: results[i].project.id,
              tokenURI: results[i].tokenURI,
              contentURI: results[i].contentURI,
              creator: results[i].creator,
              owner: results[i].owner,
              content_s3key: makeS3Path(results[i].content_s3key),
              content_thumbnail_s3key: makeS3Path(results[i].content_thumbnail_s3key),
              createdAt: results[i].createdAt,
              updatedAt: results[i].updatedAt,
            })
          }
        } else {
          this.noMoreDataToLoad = true
        }
      }

      return contentArrayToPush
    },
    async getContents() {
      const results = await this.queryContents.func(this.queryContents.body)
      return results.tokens
    }
  },
  watch: {
    queryContents: {
      async handler(val) {
        this.noMoreDataToLoad = false
        this.contentList = []
        this.queryContents = val
      }
    }
  }
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
