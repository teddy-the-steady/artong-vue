<template>
  <div>
    <ProjectList :queryProjects="queryProjects"></ProjectList>
    <div>hello</div>
  </div>
</template>

<script>
import { headerActivate } from '../../mixin'
import { graphql, queryProjects } from '../../api/graphql'
import ProjectList from '../projects/ProjectList.vue'

export default {
  name: 'Projects',
  mixins: [headerActivate],
  components: {
    ProjectList,
  },
  data() {
    return {
      queryProjects: {
        func: null,
        body: {},
      },
    }
  },
  mounted() {
    this.queryProjects = {
      func: graphql,
      body: queryProjects({
        variables: {
          first: 5,
          skip: 0,
        },
      }),
    }
  },
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/variables';

h1 {
  color: $artong-black;
}
</style>
