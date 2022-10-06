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
    <button @click="mint">MINT</button>
    {{ projectInfo }}
  </div>
</template>

<script>
import Storage from '@aws-amplify/storage'
import { mapState } from 'vuex'
import {
  postContent,
  patchContent,
  uploadToNftStorageAndUpdateContent
} from '../../api/contents'
import { ethers } from 'ethers'
import {
  ERC721_ABI,
  getPcSigner,
  getWalletConnectSigner
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
      S3_PRIVACY_LEVEL: 'public'
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

      try {
        const postResult = await postContent({
          project_address: this.$router.currentRoute.params.id,
          content_url: `${this.S3_PRIVACY_LEVEL}/${this.s3Result.key}`
        })
        const uplaodResult = await uploadToNftStorageAndUpdateContent({
          content_id: postResult.id,
          name: this.name,
          description: this.description,
          imageKey: `${this.S3_PRIVACY_LEVEL}/${this.s3Result.key}`
        })

        const tx = await this.doMint(uplaodResult.project_address, uplaodResult.ipfs_url)
        const approveReceipt = await tx.wait()
        const tokenId = parseInt(approveReceipt.events[0].args.tokenId._hex)

        await patchContent(postResult.id, { tokenId: tokenId })

        // TODO] lazy minting(policy 미리 가져와서 자동으로 선택)
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
    async doMint(projectAddress, tokenUri) {
      let signer = null
      if (this.isMobile) {
        signer = await getWalletConnectSigner()
      } else {
        signer = await getPcSigner()
      }

      const contract = new ethers.Contract(projectAddress, ERC721_ABI, signer)
      const tx = await contract.mint(this.currentUser.wallet_address, tokenUri)
      return tx
    },
    async onFileChange(e) {
      this.file = e.target.files[0]
      this.image = URL.createObjectURL(this.file)
      this.s3Result = await this.uploadToS3(
        this.$router.currentRoute.params.id,
        this.currentUser.id,
        this.file.name
      ) // TODO] thumbnail 생성
    },
  }
 }
</script>

<style lang="scss" scoped>
.upload {
  img {
    max-width: 500px;
  }
}
</style>