<template>
  <div class="container">
    <SortDropdown
      class="sort"
      :sortOptions="sortOptions"
      :sortSelected="current.sort"
    ></SortDropdown>
    <div class="tabs" ref="tabs">
      <TabItem
        v-for="tab in tabs"
        v-bind="tab"
        :key="tab.id"
        v-model="currentId"
        @tabClick="tabClick"
      />
    </div>
    <div class="items">
      <section class="item" :key="generateKey()">
        <div v-show="current.type === 'CONTENTS'">
          <ContentList :queryContents="current.api"></ContentList>
        </div>
        <div v-show="current.type === 'PROJECTS'">
          <ProjectList :queryProjects="current.api"></ProjectList>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import TabItem from './TabItem.vue'
import ContentList from '../contents_v2/ContentList.vue'
import ProjectList from '../projects/ProjectList.vue'
import SortDropdown from '../dropdown/SortDropdown.vue'

export default {
  name: 'ProfileTab',
  components: {
    TabItem,
    ContentList,
    ProjectList,
    SortDropdown,
  },
  props: {
    tabs: {
      type: Array,
      default: () => [],
    },
    sortOptions: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      currentId: parseInt(this.$router.currentRoute.query.tab) || 0,
    }
  },
  computed: {
    current() {
      return this.tabs.find(el => el.id === this.currentId) || {}
    },
    ...mapState({
      currentUser: state => state.user.currentUser,
    }),
  },
  methods: {
    tabClick(id) {
      this.currentId = id
      this.$router.push({ query: { tab: id } })
    },
    generateKey() {
      return this.currentId + this.current.sort.name + this.current.api.key
    },
  },
  watch: {
    async $route(val) {
      if (val) {
        this.currentId = parseInt(val.query.tab) || 0
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/variables';
.container {
  .tabs {
    position: relative;
    border-bottom: 1px solid #b3b3b3;
    display: flex;
    white-space: nowrap;
    overflow-x: auto;
    width: 100%;
    padding-right: 60px;
    box-sizing: border-box;
  }
  .sort {
    text-align: initial;
    float: right;
    position: relative;
    transform: translate(-10px, 40px);
    z-index: 1;
  }
}
</style>
