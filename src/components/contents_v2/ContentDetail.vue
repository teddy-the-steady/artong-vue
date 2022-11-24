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
      <button v-if="!isListed" @click="action('sell')">Sell</button>
      <button v-else @click="action('updated')">Cancel/Updated Listing</button>
    </div>
    <div v-else>
      <button v-if="isListed" @click="action('buy')">Buy</button>
      <button @click="action('offer')">Make offer</button>
    </div>
    <input v-model="price" placeholder="price">
  </div>
</template>

<script>
import { ethers } from 'ethers'
import { mapState } from 'vuex'
import { headerActivate } from '../../mixin'
import baseLazyLoading from '../../util/baseLazyLoading'
import { graphql, queryToken } from '../../api/graphql'
import { makeS3Path } from '../../util/commonFunc'
import {
  MARKETPLACE_ABI,
  MARKETPLACE,
  getPcSigner,
  getWalletConnectSigner
} from '../../contracts'

export default {
  name: 'ContentDetail',
  mixins: [headerActivate],
  data() {
    return {
      content: null,
      price: null
    }
  },
  computed: {
    ...mapState({
      currentUser: state => state.user.currentUser
    }),
    isListed() {
      return this.content?.listings[0]?.eventType === 'LISTED'
    },
    isMobile() {
      return this.$isMobile()
    }
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
    async action(which) { // TODO] 모달로 바꾸기
      let signer = null

      if (this.isMobile) {
        signer = await getWalletConnectSigner()
      } else {
        signer = await getPcSigner()
      }

      const contract = new ethers.Contract(MARKETPLACE, MARKETPLACE_ABI, signer)
      switch (which) {
        case 'sell': {
          const tx = await contract.listItem(
            this.content.project.id,
            this.content.tokenId,
            this.price
          )
          await tx.wait()
          alert('listed!')
          break;
        }
        case 'buy': {
          const tx = await contract.buyItem(
            this.content.project.id,
            this.content.tokenId,
            this.content.owner,
            {value: this.price}
          )
          await tx.wait()
          alert('purchased!')
          break;
        }
        default:
          break;
      }
    },
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