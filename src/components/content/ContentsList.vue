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
  column-width: 200px;
  padding: 0 1rem;
}

.content {
  display: inline-block;
  overflow: hidden;
  border-radius: 10px;
  margin: 0.5rem;
}
</style>
