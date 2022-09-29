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
      <input type="radio" id="r1" v-model="policy" value="0">
      <label for="r1">Mint Now</label>
      <input type="radio" id="r2" v-model="policy" value="1">
      <label for="r2">Lazy Mint</label>
    </div>
    <button @click="mint">MINT</button>
  </div>
</template>

<script>
import Storage from '@aws-amplify/storage'
import { mapState } from 'vuex'

export default {
  name: 'MintToken',
  computed: {
    ...mapState({
      currentUser: state => state.user.currentUser
    })
  },
  data() {
    return {
      file: null,
      image: '',
      name: '',
      description: '',
      policy: 0,
      message: ''
    }
  },
  methods: {
    async mint() {
      if (!this.file) {
        alert('No image to mint')
        return
      }
      console.log(this.$router.currentRoute.params.id)
      console.log(this.name, this.description, this.policy)
      await this.uploadToS3()
      // TODO] 폴링으로 db insert 체크? 완료후 민팅진행?
    },
    async uploadToS3() {
      try {
        await Storage.put(
          `nft/${this.$router.currentRoute.params.id}/${this.currentUser.id}/${this.file.name}`,
          this.file,
          {
            level: 'public',
            contentType: this.file.type
          }
        )
      } catch (error) {
        this.message = error
      }
    },
    async onFileChange(e) {
      this.file = e.target.files[0]
      this.image = URL.createObjectURL(this.file)
    },
  }
}
</script>

<style lang="scss" scoped>
</style>
