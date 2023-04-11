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
import ProjectCard from './ProjectCard.vue'

export default {
  name: 'ProjectListKeepAlive',
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
      }, 100)
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

        if (results.data.projects.length > 0) {
          for (let i = 0; i < results.data.projects.length; i++) {
            projectArrayToPush.push({
              address: results.data.projects[i].id,
              slug: results.data.projects[i].slug,
              creator: results.data.projects[i].creator,
              name: results.data.projects[i].name,
              symbol: results.data.projects[i].symbol,
              // status: results.data.projects[i].status,
              policy: results.data.projects[i].policy,
              max_amount: results.data.projects[i].maxAmount,
              background_s3key: results.data.projects[i].background_s3key,
              background_thumbnail_s3key:
                results.data.projects[i].background_thumbnail_s3key,
              project_s3key: results.data.projects[i].project_s3key,
              project_thumbnail_s3key:
                results.data.projects[i].project_thumbnail_s3key,
              contributors: results.data.projects[i].contributors,
              created_at: results.data.projects[i].createdAt,
              updated_at: results.data.projects[i].updatedAt,
            })
          }
        }

        if (!results.meta.hasMoreData) {
          this.noMoreDataToLoad = true
        }
      }

      return projectArrayToPush
    },
    async getProjects() {
      return await this.queryProjects.func(this.queryProjects.body)
    },
  },
  watch: {
    $route(to, from) {
      if (from.name === 'Projects') {
        this.noMoreDataToLoad = true
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/variables';

.projects {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(230px, 400px));
  justify-content: center;
  padding: initial;
}
</style>
