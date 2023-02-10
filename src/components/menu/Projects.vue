<template>
  <div>
    <h1>Explore Projects</h1>
    <div class="projects">
      <div class="sort">
        <SortDropdown
          :sortOptions="sortOptions"
          :sortSelected="sort"
        ></SortDropdown>
      </div>
      <ProjectList
        :queryProjects="queryProjects"
        :key="sort.name"
      ></ProjectList>
    </div>
  </div>
</template>

<script>
import { headerActivate } from '../../mixin'
import { graphql, queryProjects } from '../../api/graphql'
import ProjectList from '../projects/ProjectList.vue'
import SortDropdown from '../dropdown/SortDropdown.vue'

export default {
  name: 'Projects',
  mixins: [headerActivate],
  components: {
    ProjectList,
    SortDropdown,
  },
  data() {
    return {
      queryProjects: {
        func: null,
        body: {},
      },
      sort: {},
      sortOptions: {
        newest: {
          name: 'Newest',
          orderBy: 'createdAt',
          orderDirection: 'desc',
        },
        oldest: {
          name: 'Oldest',
          orderBy: 'createdAt',
          orderDirection: 'asc',
        },
      },
    }
  },
  created() {
    this.sort =
      this.sortOptions[this.$route.query.sort] || this.sortOptions['newest']
    this.queryProjects = {
      func: graphql,
      body: queryProjects({
        variables: {
          first: 10,
          skip: 0,
          orderBy: this.sort.orderBy,
          orderDirection: this.sort.orderDirection,
        },
      }),
    }
  },
  watch: {
    $route(to, from) {
      if (from.name !== to.name) {
        return
      }

      this.sort = this.sortOptions[to.query.sort] || this.sortOptions['newest']
      this.queryProjects = {
        func: graphql,
        body: queryProjects({
          variables: {
            first: 10,
            skip: 0,
            orderBy: this.sort.orderBy,
            orderDirection: this.sort.orderDirection,
          },
        }),
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/variables';

h1 {
  color: $artong-black;
}

.projects {
  display: flex;
  flex-direction: column;
  .sort {
    position: relative;
    display: flex;
    align-self: flex-end;
    margin-right: 5%;
  }
}
</style>
