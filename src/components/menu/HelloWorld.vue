<template>
  <div>
    <contents-list></contents-list>
  </div>
</template>

<script>
import { Auth } from 'aws-amplify'
import ContentsList from '../content/ContentsList'
export default {
  name: 'HelloWorld',
  components: {
    ContentsList
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
    background-color: $artong-white;
    padding: 35px 40px;
    text-align: left;
    display: inline-block;
    border-radius: 10px;
    width: 20%;
    min-width: 50px;
    min-height: 150px;
    margin: 0.5rem;
    box-shadow: 1px 1px 4px 0 rgba(0,0,0,.15);
}
</style>
