<template>
  <div>
    <h1>{{ $t('views.projects.title') }}</h1>
    <div class="projects">
      <div class="sort">
        <SortDropdown
          :sortOptions="sortOptions"
          :sortSelected="sort"
        ></SortDropdown>
      </div>
      <ProjectListKeepAlive
        :queryProjects="queryProjects"
        :key="sort.name"
      ></ProjectListKeepAlive>
    </div>
  </div>
</template>

<script>
import { headerActivate } from '../../mixin'
import { graphql, queryProjects } from '../../api/graphql'
import ProjectListKeepAlive from '../projects/ProjectListKeepAlive.vue'
import SortDropdown from '../dropdown/SortDropdown.vue'

export default {
  name: 'Projects',
  mixins: [headerActivate],
  components: {
    ProjectListKeepAlive,
    SortDropdown,
  },
  computed: {
    sortOptions() {
      return {
        newest: {
          name: this.$i18n.t('views.projects.sort-options.newest'),
          orderBy: 'createdAt',
          orderDirection: 'desc',
        },
        oldest: {
          name: this.$i18n.t('views.projects.sort-options.oldest'),
          orderBy: 'createdAt',
          orderDirection: 'asc',
        },
      }
    },
  },
  data() {
    return {
      queryProjects: {
        func: null,
        body: {},
      },
      sort: {},
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
    $route(to) {
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
