<template>
  <div>
    <h1>Explore Contents</h1>
    <div class="contents">
      <div class="sort">
        <SortDropdown
          :sortOptions="sortOptions"
          :sortSelected="sort"
        ></SortDropdown>
      </div>
      <ContentList
        :queryContents="queryContents"
        :key="sort.name"
      ></ContentList>
    </div>
  </div>
</template>

<script>
import { headerActivate } from '../../mixin'
import { getContents } from '../../api/contents'
import ContentList from '../contents_v2/ContentList.vue'
import SortDropdown from '../dropdown/SortDropdown.vue'

export default {
  name: 'Contents',
  mixins: [headerActivate],
  components: {
    ContentList,
    SortDropdown,
  },
  data() {
    return {
      queryContents: {
        func: null,
        queryParams: {},
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
    this.queryContents = {
      func: getContents,
      queryParams: {
        start_num: 0,
        count_num: 10,
        orderBy: this.sort.orderBy,
        orderDirection: this.sort.orderDirection,
      },
    }
  },
  watch: {
    $route(to, from) {
      if (from.name !== to.name) {
        return
      }

      this.sort = this.sortOptions[to.query.sort] || this.sortOptions['newest']
      this.queryContents = {
        func: getContents,
        queryParams: {
          start_num: 0,
          count_num: 10,
          orderBy: this.sort.orderBy,
          orderDirection: this.sort.orderDirection,
        },
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

.contents {
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
