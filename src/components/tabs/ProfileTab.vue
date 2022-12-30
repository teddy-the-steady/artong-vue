<template>
  <div>
    <div class="tabs">
      <TabItem
        v-for="tab in tabs"
        v-bind="tab"
        :key="tab.id"
        v-model="currentId"
        @tabClick="tabClick"
      />
    </div>
    <div class="items">
      <section class="item" :key="currentId">
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

export default {
  name: 'ProfileTab',
  components: {
    TabItem,
    ContentList,
    ProjectList,
  },
  props: {
    tabs: {
      type: Array,
      default: () => [],
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

.tabs {
  border-bottom: 1px solid #b3b3b3;
  margin: 0px 24px 0px 24px;
  display: flex;
}
</style>
