<template>
  <div>
    ing..
  </div>
</template>

<script>
import { getProjectWhileUpdatingCreatedPendingOne } from '../../api/projects'
export default {
  name: 'CreatingProject',
  data() {
    return {
      txHash: this.$router.currentRoute.query.txHash
    }
  },
  methods: {
    wait(timeToDelay) {
      return new Promise((resolve) => setTimeout(resolve, timeToDelay))
    },
    async getProjectWhileUpdatingCreatedPendingOne() {
      for (;;) {
        const result = getProjectWhileUpdatingCreatedPendingOne(this.txHash)
        if (result.data && result.data.status === 'CREATED') {
          break
        }
        if (this.$router.currentRoute.name !== 'CreatingProject') {
          break
        }
        await this.wait(3000)
      }
    }
  },
  async mounted() {
    await this.getProjectWhileUpdatingCreatedPendingOne()
  },
  watch: {
    async $route(val) {
      if (val.name === 'CreatingProject') {
        await this.getProjectWhileUpdatingCreatedPendingOne()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
