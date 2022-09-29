<template>
  <div>
    <project-list :projectsApi="projectsApi"></project-list>
  </div>
</template>

<script>
import ProjectList from '../projects/ProjectList'
import { headerActivate } from '../../mixin'
import { getProjects } from '../../api/projects'
import { CREATED } from '../../constants'

export default {
  name: 'Projects',
  mixins: [headerActivate],
  components: {
    ProjectList
  },
  data() {
    return {
      projectsApi: {
        func: null,
        query: {}
      }
    }
  },
  mounted() {
    this.projectsApi = {
      func: getProjects,
      query: {
        start_num: 0,
        count_num: 5,
        status: CREATED
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/variables';

h1 {
  color: $artong-black;
}
</style>
