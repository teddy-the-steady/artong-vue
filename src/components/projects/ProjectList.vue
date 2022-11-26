<template>
  <div>
    <div class="projects">
      <div class="info">explore projects</div>
      <div class="project" v-for="(val, i) in projectList" :key="i">
        <router-link :to="{ name: 'Project', params: { id: val.address } }">
          <project-box :project="val"></project-box>
        </router-link>
      </div>
    </div>
    <infinite-loading
      @infinite="infiniteHandler"
      spinner="spiral"
    ></infinite-loading>
  </div>
</template>

<script>
import InfiniteLoading from 'vue-infinite-loading'
import { makeS3Path } from '../../util/commonFunc'
import ProjectBox from './ProjectBox.vue'

export default {
  name: 'ProjectList',
  components: {
    ProjectBox,
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
              creator: results[i].creator,
              name: results[i].name,
              symbol: results[i].symbol,
              // status: results[i].status,
              policy: results[i].policy,
              max_amount: results[i].maxAmount,
              background_s3key: makeS3Path(results[i].background_s3key),
              background_thumbnail_s3key: makeS3Path(
                results[i].background_thumbnail_s3key,
              ),
              project_s3key: makeS3Path(results[i].thumbnail_s3key),
              project_thumbnail_s3key: makeS3Path(
                results[i].project_thumbnail_s3key,
              ),
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
  display: flex;
  flex-flow: row wrap;

  .info {
    display: none;
  }

  .project {
    flex: 1;
    height: 400px;
    margin: 10px;
  }
}

@mixin max-width($width) {
  @media screen and (max-width: $width) {
    @content;
  }
}

@media screen {
  .projects {
    .project {
      flex-basis: 10%;
    }
  }
}

@include max-width(2200px) {
  .projects {
    .project {
      flex-basis: 15%;
    }
  }
}

@include max-width(1500px) {
  .projects {
    .project {
      flex-basis: 25%;
    }
  }
}

@include max-width(1200px) {
  .projects {
    .project {
      flex-basis: 30%;
    }
  }
}

@include max-width(830px) {
  .projects {
    .project {
      flex-basis: 50%;
    }
  }
}

@include max-width(600px) {
  .projects {
    .project {
      flex-basis: 100%;
    }
  }
}
</style>
