<template>
  <div>
    <div class="projects">
      <div class="info">explore projects</div>
      <div class="project" v-for="(val, i) in projectList" :key="i">
        <router-link :to="{ name: 'Project', params: { id: val.address }}">
          <project-box :project="val"></project-box>
        </router-link>
      </div>
    </div>
    <infinite-loading @infinite="infiniteHandler" spinner="spiral"></infinite-loading>
  </div>
</template>

<script>
import ProjectBox from './ProjectBox'
import InfiniteLoading from 'vue-infinite-loading'
import { makeS3Path, deepCopy } from '../../util/commonFunc'

export default {
  name: 'ProjectList',
  components: {
    ProjectBox, InfiniteLoading
  },
  props: {
    queryProjects: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      projectList: [],
      noMoreDataToLoad: false
    }
  },
  methods: {
    async infiniteHandler($state) {
      if (this.noMoreDataToLoad) {
        $state.complete()
        return
      }
      await this.pushContents()
      this.checkMoreDataToLoad()
      setTimeout(function() { $state.loaded() }, 1000)
    },
    async pushContents() {
      const projectArrayToPush = await this.makeProjectArray()
      this.pushProjects(projectArrayToPush, this.projectList)
    },
    async makeProjectArray() {
      const projectArrayToPush = []
      if (this.queryProjects) {
        const results = await this.getContents(this.queryProjects)
        this.queryProjects.body.variables.skip += this.queryProjects.body.variables.first

        if (results.length > 0) {
          for (let i = 0; i < results.length; i++) {
            projectArrayToPush.push({
              index: i,
              address: results[i].address,
              member_id: results[i].member_id,
              name: results[i].name,
              symbol: results[i].symbol,
              status: results[i].status,
              background_url: this.getImageUrl(results[i].background_url),
              thumbnail_url: this.getImageUrl(results[i].thumbnail_url),
              created_at: results[i].created_at,
              updated_at: results[i].updated_at,
              total: results[i].total
            })
          }
        }
      }

      return projectArrayToPush
    },
    async getContents() {
      const results = await this.queryProjects.func(this.queryProjects.body)
      return results
    },
    pushProjects(projectArrayToPush, projectList) {
      const lastProject = projectList[projectList.length - 1]
      for (let i in projectArrayToPush) {
        if (lastProject) {
          const lastProjectCopy = deepCopy(lastProject)
          projectArrayToPush[i].index = ++lastProjectCopy.index
        }
        projectList.push(projectArrayToPush[i])
      }
    },
    checkMoreDataToLoad() {
      if (this.projectList.length === this.projectList[0].total) {
        this.noMoreDataToLoad = true
      }
    },
    getImageUrl(path) {
      return makeS3Path(path)
    }
  }
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