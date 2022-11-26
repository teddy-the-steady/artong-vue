<template>
  <div>
    <div class="tabs">
      <tab-item
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
          <content-list :queryContents="current.api"></content-list>
        </div>
        <div v-show="current.type === 'PROJECTS'">
          <project-list :queryProjects="current.api"></project-list>
        </div>
        {{ current }}
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
      return this.tabs.find((el) => el.id === this.currentId) || {}
    },
    ...mapState({
      currentUser: (state) => state.user.currentUser,
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

<style lang="scss" scoped></style>
