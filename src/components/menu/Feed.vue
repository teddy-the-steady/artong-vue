<template>
  <div>
    <h1>{{ $t('views.feed.title') }}</h1>
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
import { getFeedContents } from '../../api/contents'
import ContentList from '../contents_v2/ContentList.vue'
import SortDropdown from '../dropdown/SortDropdown.vue'

export default {
  name: 'Feed',
  mixins: [headerActivate],
  components: {
    ContentList,
    SortDropdown,
  },
  computed: {
    sortOptions() {
      return {
        newest: {
          name: this.$i18n.t('views.feed.sort-options.newest'),
          orderBy: 'createdAt',
          orderDirection: 'desc',
        },
        oldest: {
          name: this.$i18n.t('views.feed.sort-options.oldest'),
          orderBy: 'createdAt',
          orderDirection: 'asc',
        },
      }
    },
  },
  data() {
    return {
      queryContents: {
        func: null,
        queryParams: {},
      },
      sort: {},
    }
  },
  created() {
    this.sort =
      this.sortOptions[this.$route.query.sort] || this.sortOptions['newest']
    this.queryContents = {
      func: getFeedContents,
      queryParams: {
        start_num: 0,
        count_num: 10,
        orderBy: this.sort.orderBy,
        orderDirection: this.sort.orderDirection,
      },
    }
  },
  watch: {
    $route(to) {
      this.sort = this.sortOptions[to.query.sort] || this.sortOptions['newest']
      this.queryContents = {
        func: getFeedContents,
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
