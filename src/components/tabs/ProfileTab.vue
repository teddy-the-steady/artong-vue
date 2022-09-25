<template>
  <div>
    <div class="tabs">
      <profile-tab-item
        v-for="item in list"
        v-bind="item" :key="item.id"
        v-model="currentId"
        @tabClick="tabClick"/>
    </div>
    <div class="contents">
      <section class="item" :key="currentId">
        {{ current.content }}
      </section>
    </div>
  </div>
</template>

<script>
import ProfileTabItem from './ProfileTabItem'

export default {
  name: 'ProfileTab',
  components: {
    ProfileTabItem
  },
  data() {
    return {
      currentId: 1,
      list: [
        { id: 1, label: 'Tab1', content: '콘텐츠1' },
        { id: 2, label: 'Tab2', content: '콘텐츠2' },
        { id: 3, label: 'Tab3', content: '콘텐츠3' }
      ]
    }
  },
  computed: {
    current() {
      return this.list.find(el => el.id === this.currentId) || {}
    }
  },
  methods: {
    tabClick(id) {
      this.currentId = id
    }
  }
}
</script>

<style lang="scss" scoped>
</style>