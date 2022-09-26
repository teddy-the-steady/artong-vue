<template>
  <div>
    <div class="tabs">
      <profile-tab-item
        v-for="tab in tabs"
        v-bind="tab" :key="tab.id"
        v-model="currentId"
        @tabClick="tabClick"/>
    </div>
    <div class="items">
      <section class="item" :key="currentId">
        <div v-if="current.type === 'TOKENS'">
          <content-list :contentsApi="current.api"></content-list>
        </div>
        <div v-else>
          {{ current }}
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ProfileTabItem from './ProfileTabItem'
import ContentList from '../contentsV2/ContentList'

export default {
  name: 'ProfileTab',
  components: {
    ProfileTabItem, ContentList
  },
  props: {
    tabs: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      currentId: 1
    }
  },
  computed: {
    current() {
      return this.tabs.find(el => el.id === this.currentId) || {}
    },
    ...mapState({
      currentUser: state => state.user.currentUser
    })
  },
  methods: {
    tabClick(id) {
      this.currentId = id
    }
  }
}
</script>

<style lang="scss" scoped>
.item {
  padding: 0 10%;
}
</style>