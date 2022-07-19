<template>
  <div class="projects">
    <div class="project" v-for="(val, i) in projectList" :key="i">
      <!-- <router-link :to="{ name: 'Artwork', params: { id: val.id_pk || val.url }}"> -->
      <project-box :project="val"></project-box>
      <!-- </router-link> -->
    </div>
    <infinite-loading @infinite="infiniteHandler" spinner="spiral"></infinite-loading>
  </div>
</template>

<script>
import ProjectBox from './ProjectBox'
import InfiniteLoading from 'vue-infinite-loading'

export default {
  name: 'ProjectList',
  components: {
    ProjectBox, InfiniteLoading
  },
  data() {
    return {
      projectList: [{id: 0, name: "test"}],
      lastLoadedId: null,
      noMoreDataToLoad: false
    }
  },
  methods: {
    infiniteHandler($state) {
      if (this.noMoreDataToLoad) {
        $state.complete()
        return
      }
      this.pushProjects()
      setTimeout(function() { $state.loaded() }, 500)
    },
    pushProjects() {
      for (let i = 0; i < 8; i++) {
        this.projectList.push({
          id: i,
          name: "test"
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/variables';

@mixin max-width($width) {
  @media screen and (max-width: $width) {
    @content;
  }
}

.projects {
  display: flex;
  flex-flow: row wrap;

  .project {
    flex: 1;
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