<template>
  <div class="contents">
    <masonry :cols="{default: 7, 1500:6, 1300: 5, 1100: 4, 850: 3, 570: 2, 310: 1}">
      <div class="content" v-for="(val, i) in imageList" :key="i">
        <router-link :to="{ name: 'Artwork', params: { id: val.id_pk || val.url }}">
          <content-box :image="val"></content-box>
        </router-link>
        <router-link class="profileBox" :to="{ name: 'UserOrArtist', params: { id: val.username }}">
          <contents-profile :image="val"></contents-profile>
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
import axios from 'axios'
import { makeS3Path, deepCopy } from '../../util/commonFunc'

export default {
  name: 'ContentListV2',
  components: {
    ContentBox, ContentsProfile, InfiniteLoading
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
          const lastImageCopy = deepCopy(lastImage)
          imageArrayToPush[i].index = ++lastImageCopy.index
        }
        imageList.push(imageArrayToPush[i])
      }
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
              profileImageUrl: results[i].profile_thumbnail_s3key ?
                this.getImageUrl(results[i].profile_thumbnail_s3key) :
                this.getImageUrl(results[i].profile_s3key),
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
            profileImageUrl: 'https://artong-stage-image163347-stage.s3.ap-northeast-2.amazonaws.com/public/thumbnails/profile/316/resized-KakaoTalk_Photo_2022-08-26-09-47-58 001.jpeg',
            username: '0xf042403cdf2cb073a2a371dce25a4f94dc8660df',
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
  display: block;
  height: 30px;
  padding: 10px;
}
</style>
