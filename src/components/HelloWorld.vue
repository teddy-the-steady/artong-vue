<template>
  <div>
    <div>
      <div v-for="i in 50" :key="i" class="content"></div>
    </div>
  </div>
</template>

<script>
import { Auth } from 'aws-amplify'
export default {
  name: 'HelloWorld',
  data () {
    return {}
  },
  created () {
    this.findUser()
  },
  computed: {
    signedIn () {
      return this.$store.state.signedIn
    }
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

<style scoped>
.content {
    background-color: var(--white);
    padding: 35px 40px;
    text-align: left;
    display: inline-block;
    min-width: 100px;
    min-height: 200px;
    margin: 1rem;
    box-shadow: 1px 1px 4px 0 rgba(0,0,0,.15);
}
</style>
