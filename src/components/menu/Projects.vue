<template>
  <div>
    <project-list :queryProjects="queryProjects"></project-list>
  </div>
</template>

<script>
import ProjectList from '../projects/ProjectList'
import { headerActivate } from '../../mixin'
import { graphql } from '../../api/graphql'

export default {
  name: 'Projects',
  mixins: [headerActivate],
  components: {
    ProjectList
  },
  data() {
    return {
      queryProjects: {
        func: null,
        body: {}
      }
    }
  },
  mounted() {
    this.queryProjects = {
      func: graphql,
      body: {query: `
        query Projects($first: Int, $skip: Int) {
          projects(first: $first, skip: $skip) {
            id
            creator
            owner
            name
            symbol
            maxAmount
            policy
            isDisabled
            createdAt
            updatedAt
            _db_project_s3key
            _db_project_thumbnail_s3key
            _db_background_s3key
            _db_background_thumbnail_s3key
          }
        }
      `, variables: {
          first: 5,
          skip: 0
        }
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
