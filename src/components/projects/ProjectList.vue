<template>
  <div>
    <div class="projects">
      <div v-for="(val, i) in projectList" :key="i">
        <router-link
          :to="{
            name: 'Project',
            params: { id: val.slug || val.address },
          }"
        >
          <ProjectCard :project="val"></ProjectCard>
        </router-link>
      </div>
    </div>
    <InfiniteLoading
      @infinite="infiniteHandler"
      spinner="spiral"
    ></InfiniteLoading>
  </div>
</template>

<script>
import InfiniteLoading from 'vue-infinite-loading'
import ProjectCard from '../projects/ProjectCard.vue'

export default {
  name: 'ProjectList',
  components: {
    ProjectCard,
    InfiniteLoading,
  },
  props: {
    queryProjects: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      projectList: [],
      noMoreDataToLoad: false,
    }
  },
  methods: {
    async infiniteHandler($state) {
      if (this.noMoreDataToLoad) {
        $state.complete()
        return
      }
      await this.pushData()
      setTimeout(function () {
        $state.loaded()
      }, 1000)
    },
    async pushData() {
      const projectArrayToPush = await this.makeProjectArray()
      if (projectArrayToPush.length > 0) {
        for (let i in projectArrayToPush) {
          this.projectList.push(projectArrayToPush[i])
        }
      }
    },
    async makeProjectArray() {
      const projectArrayToPush = []
      if (this.queryProjects) {
        const results = await this.getProjects(this.queryProjects)
        this.queryProjects.body.variables.skip +=
          this.queryProjects.body.variables.first

        if (results.length > 0) {
          for (let i = 0; i < results.length; i++) {
            projectArrayToPush.push({
              address: results[i].id,
              slug: results[i].slug,
              creator: results[i].creator,
              name: results[i].name,
              symbol: results[i].symbol,
              // status: results[i].status,
              policy: results[i].policy,
              max_amount: results[i].maxAmount,
              background_s3key: results[i].background_s3key,
              background_thumbnail_s3key: results[i].background_thumbnail_s3key,
              project_s3key: results[i].project_s3key,
              project_thumbnail_s3key: results[i].project_thumbnail_s3key,
              contributors: results[i].contributors,
              created_at: results[i].createdAt,
              updated_at: results[i].updatedAt,
            })
          }
        } else {
          this.noMoreDataToLoad = true
        }
      }

      return projectArrayToPush
    },
    async getProjects() {
      const results = await this.queryProjects.func(this.queryProjects.body)
      return results.projects
    },
  },
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/variables';

.projects {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 400px));
  justify-content: center;
  padding: initial;
}
</style>
