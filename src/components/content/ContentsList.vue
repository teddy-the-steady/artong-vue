<template>
  <div>
    <div class="container">
      <div v-for="i in 50" :key="i" class="content">
        <content-box></content-box>
      </div>
    </div>
  </div>
</template>

<script>
import { Auth } from 'aws-amplify'
import ContentBox from './ContentBox'
export default {
  name: 'ContentsList',
  components: {
    ContentBox
  },
  data () {
    return {}
  },
  created () {
    this.findUser()
  },
  methods: {
    async findUser () {
      try {
        const user = await Auth.currentAuthenticatedUser()
        this.$store.state.signedIn = true
        this.$store.state.user = user
      } catch (err) {
        this.$store.state.signedIn = false
        this.$store.state.user = null
      }
    }
  },
  mounted () {
    this.$store.commit('setBrowserNavTrue')
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/variables';

.container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.content {
  overflow: hidden;
  border-radius: 10px;
  width: 23%;
  height: 100%;
  min-width: 145px;
  margin: 0.5rem;
  box-shadow: 1px 1px 4px 0 rgba(0,0,0,.15);
}
</style>
