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
        {{ current }}
      </section>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import TabItem from './TabItem.vue'
import ContentList from '../contents_v2/ContentList.vue'

export default {
  name: 'ProjectTab',
  components: {
    TabItem,
    ContentList,
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
