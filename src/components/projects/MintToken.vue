<template>
  <div>
    <div class="upload">
      <img v-if="image" :src="image"/>
      <input ref="fileInput" type="file" @change="onFileChange">
    </div>
    {{ message }}
    <div>
      <span>Name</span>
      <input v-model="name" placeholder="name">
    </div>
    <div>
      <span>Description</span>
      <input v-model="description" placeholder="description">
    </div>
    <div>
      <span>WHEN?</span>
      <input type="radio" id="r1" v-model="policy" value="0" :disabled="projectInfo.policy === 1">
      <label for="r1">Mint Now</label>
      <input type="radio" id="r2" v-model="policy" value="1" :disabled="projectInfo.policy === 1">
      <label for="r2">Lazy Mint</label>
    </div>
    <button class="btn_mint" @click="mint">MINT</button>
    <input v-model="mintPrice" placeholder="mintPrice">
    <button @click="redeem">REDEEM(test)</button>
    <input v-model="redeemPrice" placeholder="redeemPrice">
    {{ projectInfo }}
  </div>
</template>

<script>
import Storage from '@aws-amplify/storage'
import { mapState } from 'vuex'
import {
  postContent,
  patchContent,
  uploadToNftStorage,
  getContent,
  getIpfsMetadata,
} from '../../api/contents'
import { ethers } from 'ethers'
import {
  ERC721_ABI,
  getPcSigner,
  getWalletConnectSigner,
  LazyMinter
} from '../../contracts'

export default {
  name: 'MintToken',
  computed: {
    ...mapState({
      currentUser: state => state.user.currentUser
    })
  },
  props: {
    projectInfo: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      file: null,
      image: '',
      name: '',
      description: '',
      policy: 1,
      message: '',
      s3Result: {},
      postResult: {},
      S3_PRIVACY_LEVEL: 'public',
      redeemPrice: 0,
      mintPrice: 0
    }
  },
  methods: {
    async mint() {
      if (!this.file) {
        alert('No image to mint')
        return
      }

      if (!this.s3Result) {
        alert('Please attach your file again')
        return
      }

      const lazyMint = this.policy === 1

      try {
        const metadata = await uploadToNftStorage({
          name: this.name,
          description: this.description,
          imageKey: `${this.S3_PRIVACY_LEVEL}/${this.s3Result.key}`
        })

        const metadataObject = await getIpfsMetadata(metadata)

        if (lazyMint) {
          const voucher = await this.makeLazyMintingVoucher(
            this.postResult.project_address,
            metadata.url,
            metadataObject.data.image || '',
          )
          await patchContent(this.postResult.id, {
            voucher: voucher,
            isRedeemed: false,
            ipfs_url: metadata.url
          })
        } else {
          const tx = await this.doMint(
            this.postResult.project_address,
            metadata.url,
            metadataObject.data.image || ''
          )
          const approveReceipt = await tx.wait()
          const tokenId = parseInt(approveReceipt.events[0].args.tokenId._hex)

          await patchContent(this.postResult.id, {
            tokenId: tokenId,
            ipfs_url: metadata.url
          })
        }
      } catch (error) {
        this.message = error
        this.image = null
        this.file = null
      }
    },
    async uploadToS3(projectsAddress, memberId, fileName) {
      try {
        const result = await Storage.put(
          `nft/${projectsAddress}/${memberId}/${fileName}`,
          this.file,
          {
            level: this.S3_PRIVACY_LEVEL,
            contentType: this.file.type
          }
        )
        return result
      } catch (error) {
        this.message = error
        this.image = null
        this.file = null
      }
    },
    async doMint(projectAddress, tokenUri, contentUri) {
      let signer = null
      if (this.isMobile) {
        signer = await getWalletConnectSigner()
      } else {
        signer = await getPcSigner()
      }

      const contract = new ethers.Contract(projectAddress, ERC721_ABI, signer)
      const tx = await contract.mint(this.currentUser.wallet_address, tokenUri, contentUri)
      return tx
    },
    async makeLazyMintingVoucher(projectAddress, tokenUri, contentUri) {
      let signer = null
      if (this.isMobile) {
        signer = await getWalletConnectSigner()
      } else {
        signer = await getPcSigner()
      }

      const lazyMinter = new LazyMinter({
        contract: new ethers.Contract(projectAddress, ERC721_ABI, signer),
        signer: signer
      })
      const voucher = await lazyMinter.createVoucher(
        this.currentUser.wallet_address,
        tokenUri,
        contentUri,
        this.mintPrice
      )
      return voucher
    },
    async onFileChange(e) {
      this.file = e.target.files[0]
      this.image = URL.createObjectURL(this.file)

      this.postResult = await postContent({
        project_address: this.$router.currentRoute.params.id,
        content_s3key: `${this.S3_PRIVACY_LEVEL}/nft/${this.$router.currentRoute.params.id}/${this.currentUser.id}/${this.file.name}`
      })

      this.s3Result = await this.uploadToS3(
        this.$router.currentRoute.params.id,
        this.currentUser.id,
        this.file.name
      )
    },
    async redeem() {
      let signer = null
      if (this.isMobile) {
        signer = await getWalletConnectSigner()
      } else {
        signer = await getPcSigner()
      }

      const contentId = 113

      const contentResult = await getContent(contentId)
      const voucher = contentResult.voucher

      const contract = new ethers.Contract(this.$router.currentRoute.params.id, ERC721_ABI, signer)
      const tx = await contract.redeem(this.currentUser.wallet_address, voucher, {value: this.redeemPrice})
      const approveReceipt = await tx.wait()
      const tokenId = parseInt(approveReceipt.events[0].args.tokenId._hex)

      await patchContent(contentId, {
        tokenId: tokenId,
        isRedeemed: true
      })
    }
  }
 }
</script>

<style lang="scss" scoped>
.upload {
  img {
    max-width: 500px;
  }
}

.btn_mint {
  margin: 10px;
}
</style>