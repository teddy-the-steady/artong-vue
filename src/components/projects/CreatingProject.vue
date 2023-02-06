<template>
  <div>
    <div v-if="created">created!</div>
    <div v-else>ing..</div>
    <progress id="progress" :value="progress" min="0" max="100"></progress>
  </div>
</template>

<script>
import { getProjectWhileUpdatingPendingToCreated } from '../../api/projects'
import { CREATED } from '../../constants'
import { headerActivate } from '../../mixin'

export default {
  name: 'CreatingProject',
  mixins: [headerActivate],
  data() {
    return {
      txHash: this.$router.currentRoute.query.txHash,
      created: false,
      progress: 0,
    }
  },
  methods: {
    updateValue() {
      setTimeout(() => {
        this.progress += 5
      }, 1000)
    },
    wait(timeToDelay) {
      return new Promise(resolve => setTimeout(resolve, timeToDelay))
    },
    async getProject() {
      for (;;) {
        const result = await getProjectWhileUpdatingPendingToCreated(
          this.txHash,
        )
        if (result && result.status === CREATED) {
          // TODO] 다른 화면으로 리다이렉트!!!
          break
        }
        if (this.$router.currentRoute.name !== 'CreatingProject') {
          break
        }
        await this.wait(3000)
      }
      this.created = true
    },
  },
  async mounted() {
    await this.getProject()
  },
  watch: {
    progress(val) {
      this.updateValue()
      console.log(val)
    },
    async $route(val) {
      if (val.name === 'CreatingProject') {
        await this.getProject()
      }
    },
  },
  created() {
    this.progress = 5
  },
}
</script>

<style lang="scss" scoped></style>
