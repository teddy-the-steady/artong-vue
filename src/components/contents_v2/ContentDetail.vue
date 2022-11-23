<template>
  <div>
    <img
      :src="makeS3Path(content.content_thumbnail_s3key) ||
            makeS3Path(content.content_s3key) ||
            this.content.contentURI.replace('ipfs://', 'https://ipfs.io/ipfs/')"
      @error="replaceImage"
    />
    {{content}}
    <div v-if="content.owner === currentUser.wallet_address">
      <button v-if="!content.listed">Sell</button>
      <button v-else>Cancel/Updated Listing</button>
    </div>
    <div v-else>
      <button v-if="content.listed">Buy</button>
      <button>Make offer</button>
    </div>
  </div>
</template>

<script>
import { headerActivate } from '../../mixin'
import { mapState } from 'vuex'
import baseLazyLoading from '../../util/baseLazyLoading'
import { graphql, queryToken } from '../../api/graphql'
import { makeS3Path } from '../../util/commonFunc'

export default {
  name: 'ContentDetail',
  mixins: [headerActivate],
  data() {
    return {
      content: null
    }
  },
  computed: {
    ...mapState({
      currentUser: state => state.user.currentUser
    })
  },
  extends: baseLazyLoading(async (to, callback) => {
    const result = await graphql(queryToken({
      variables: {
        id: to.params.project_address + to.params.token_id
      },
      db: {
        project_address: to.params.project_address,
        token_id: to.params.token_id
      }
    }))
    callback(function() {
      this.content = result.token
    })
  }),
  methods: {
    replaceImage(e) {
      const imageUrl = e.target.currentSrc
      if (imageUrl.indexOf('resized-') > -1) {
        e.target.src = this.content.content_s3key
      } else {
        e.target.src = this.content.contentURI.replace('ipfs://', 'https://ipfs.io/ipfs/')
      }
    },
    makeS3Path(path) {
      return makeS3Path(path)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/variables';
</style>
