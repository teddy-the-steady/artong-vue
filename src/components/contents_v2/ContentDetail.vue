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
      <button v-else @click="action('update')">Cancel/Update Listing</button>
    </div>
    <div v-else>
      <button v-if="isListed" @click="action('buy')">Buy</button>
      <button @click="action('offer')">Make offer</button>
    </div>

    <input v-model="price" placeholder="price in ETH">

    <div>
      OFFER LIST
      <ul v-for="(val, i) in content.offers" :key="i">
        CREATED: {{new Date(val.createdAt * 1000)}} / Offeror: {{val.from}} / Price: {{weiToEther(val.price)}} ETH / isAccepted: {{val.isAccepted}} / Deadline: {{new Date(val.deadline * 1000)}}
        <button v-if="isCurrentUserTokenOwner && !val.isAccepted && new Date(val.deadline * 1000) > new Date()" @click="action('accept', val.from)">Accept Offer</button>
        <button v-if="isCurrentUserTokenOwner && val.isAccepted">Accepted</button>
        <button v-if="isCurrentUserTokenOwner && new Date(val.deadline * 1000) <= new Date()">Expired</button>
      </ul>
    </div>
  </div>
</template>

<script>
import { ethers } from 'ethers'
import { mapState } from 'vuex'
import { headerActivate } from '../../mixin'
import baseLazyLoading from '../../util/baseLazyLoading'
import { graphql, queryToken } from '../../api/graphql'
import { makeS3Path, etherToWei, weiToEther } from '../../util/commonFunc'
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
      const eventType = this.content?.listings[0]?.eventType
      return eventType === 'LISTED' || eventType === 'UPDATED'
    },
    isMobile() {
      return this.$isMobile()
    },
    isCurrentUserTokenOwner() {
      return this.currentUser.wallet_address === this.content.owner
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
    async action(which, acceptParam) { // TODO] 모달로 바꾸기
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
            etherToWei(this.price)
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
            {value: etherToWei(this.price)}
          )
          await tx.wait()
          alert('purchased!')
          break;
        }
        case 'cancel': {
          const tx = await contract.cancelListing(
            this.content.project.id,
            this.content.tokenId,
          )
          await tx.wait()
          alert('canceled!')
          break;
        }
        case 'update': {
          const tx = await contract.updateListing(
            this.content.project.id,
            this.content.tokenId,
            etherToWei(this.price),
          )
          await tx.wait()
          alert('updated!')
          break;
        }
        case 'offer': {
          const tx = await contract.createOffer(
            this.content.project.id,
            this.content.tokenId,
            1,
            {value: etherToWei(this.price)}
          )
          await tx.wait()
          alert('offered!')
          break;
        }
        case 'accept': {
          const tx = await contract.acceptOffer(
            this.content.project.id,
            this.content.tokenId,
            acceptParam
          )
          await tx.wait()
          alert('accepted!')
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
    },
    weiToEther(wei) {
      return weiToEther(wei)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/variables';
</style>
