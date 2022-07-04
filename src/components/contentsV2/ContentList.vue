<template>
  <div class="contents">
    <masonry :cols="{default: 7, 1500:6, 1300: 5, 1100: 4, 850: 3, 570: 2, 310: 1}">
      <div class="content" v-for="(val, i) in imageList" :key="i">
        <router-link :to="{ name: 'Artwork', params: { id: val.id_pk || val.url }}">
          <content-box :image="val"></content-box>
        </router-link>
        <div class="profileBox">
          <router-link :to="{ name: 'UserOrArtist', params: { id: val.username }}">
            <under-contents-profile :image="val"></under-contents-profile>
          </router-link>
        </div>
      </div>
    </masonry>
    <infinite-loading :identifier="$route.params.id" @infinite="infiniteHandler" spinner="spiral"></infinite-loading>
  </div>
</template>

<script>
import ContentBox from './ContentBox'
import UnderContentsProfile from '../profile/UnderContentsProfile'
import InfiniteLoading from 'vue-infinite-loading'
import axios from 'axios'
import { makeS3Path } from '../../util/commonFunc'

export default {
  name: 'ContentListV2',
  components: {
    ContentBox, UnderContentsProfile, InfiniteLoading
  },
  props: {
    contentsApi: {
      type: Object,
      default: null
    },
    numberOfContentsToLoad: {
      type: Number,
      default: 10
    }
  },
  data() {
    return {
      imageList: [],
      lastLoadedId: null,
      noMoreDataToLoad: false
    }
  },
  methods: {
    async infiniteHandler($state) {
      if (this.noMoreDataToLoad) {
        $state.complete()
        return
      }
      await this.pushContents()
      setTimeout(function() { $state.loaded() }, 500)
    },
    async pushContents() {
      const imageArrayToPush = await this.makeImageArray()
      this.pushImages(imageArrayToPush, this.imageList)
    },
    pushImages(imageArrayToPush, imageList) {
      const lastImage = imageList[imageList.length - 1]
      for (let i in imageArrayToPush) {
        if (lastImage) {
          const lastImageCopy = this.deepCopy(lastImage)
          imageArrayToPush[i].index = ++lastImageCopy.index
        }
        imageList.push(imageArrayToPush[i])
      }
    },
    deepCopy(obj) {
      return JSON.parse(JSON.stringify(obj))
    },
    async makeImageArray() {
      const imageArrayToPush = []
      if (this.contentsApi) {
        let results = null
        results = await this.getContents(this.contentsApi, this.numberOfContentsToLoad)

        if (results) {
          for (let i = 0; i < results.length; i++) {
            imageArrayToPush.push({
              index: i,
              id_pk: results[i].id,
              url: this.getImageUrl(results[i].thumbnail_url),
              profileUrl: results[i].profile_pic ? this.getImageUrl(results[i].profile_pic) : '',
              username: results[i].username,
              like: results[i].like
            })
          }
        }
      } else { // TODO] 일단은 임시 컨텐츠들. content-list props으로 contentsApi가 안넘어오면 결국은 No contents 보여줘야 할듯
        for (let i = 0; i < this.numberOfContentsToLoad; i++) {
          const randomInt = this.getRandomIntInclusive(11, 20)
          imageArrayToPush.push({
            index: i,
            url: randomInt,
            profileUrl: 'https://artong-stage-image163347-stage.s3.ap-northeast-2.amazonaws.com/public/superduper8989/profile/aimyon.jpeg',
            username: 'superduper8989',
            like: false
          })
        }
      }
      return imageArrayToPush
    },
    getImageUrl(path) {
      return makeS3Path(path)
    },
    getRandomIntInclusive(min, max) {
      min = Math.ceil(min)
      max = Math.floor(max)
      const result = Math.floor(Math.random() * (max - min + 1)) + min
      return result
    },
    async getContents(contentsApi, numOfImages) {
      let results = await axios.get(contentsApi.url, {
        params: {
          username: contentsApi.params.id ? contentsApi.params.id : null,
          pageSize: numOfImages,
          lastId: this.lastLoadedId
        }
      })
      this.lastLoadedId = results.length > 0 ? results[results.length - 1].id : null
      this.noMoreDataToLoad = results.length < numOfImages
      return results
    },
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/variables';

.contents {
  margin-top: 10px;
}

.profileBox {
  padding: 10px;
}
</style>
