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
import ContentBox from './ContentBox'
import ContentsProfile from '../profile/ContentsProfile'
import InfiniteLoading from 'vue-infinite-loading'
import { makeS3Path, deepCopy } from '../../util/commonFunc'

export default {
  name: 'ContentListV2',
  components: {
    ContentBox, ContentsProfile, InfiniteLoading
  },
  props: {
    queryContents: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      contentList: [],
      noMoreDataToLoad: false
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
        this.pushContents(contentArrayToPush, this.contentList)
        this.checkMoreDataToLoad()
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
              content_s3key: results[i].content_thumbnail_s3key ?
                this.getImageUrl(results[i].content_thumbnail_s3key) :
                this.getImageUrl(results[i].content_s3key),
              createdAt: results[i].createdAt,
              updatedAt: results[i].updatedAt
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
    },
    pushContents(contentArrayToPush, contentList) {
      const lastContent = contentList[contentList.length - 1]
      for (let i in contentArrayToPush) {
        if (lastContent) {
          const lastContentCopy = deepCopy(lastContent)
          contentArrayToPush[i].index = ++lastContentCopy.index
        }
        contentList.push(contentArrayToPush[i])
      }
    },
    checkMoreDataToLoad() {
      if (this.contentList.length === this.contentList[0].total) {
        this.noMoreDataToLoad = true
      }
    },
    getImageUrl(path) {
      return makeS3Path(path)
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
