<template>
  <div>
    ing..
  </div>
</template>

<script>
import { getProject } from '../../api/projects'
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
    async getProject() {
      for (;;) {
        const result = await getProject(this.txHash)
        if (result && result.status === 'CREATED') {
          // TODO] 다른 화면으로 리다이렉트!!!
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
    await this.getProject()
  },
  watch: {
    async $route(val) {
      if (val.name === 'CreatingProject') {
        await this.getProject()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
