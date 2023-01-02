<template>
  <div>
    <div class="tabs">
      <TabItem
        v-for="tab in tabs"
        v-bind="tab"
        :key="tab.id"
        v-model="currentId"
        @tabClick="tabClick"
        v-show="tab.type !== 'INFO' || (tab.type === 'INFO' && width < 1440)"
      />
      <SortDropdown class="sort"></SortDropdown>
    </div>
    <div class="items">
      <section class="item" :key="currentId">
        <div v-show="current.type === 'CONTENTS'">
          <ContentList
            :queryContents="current.api"
            :windowWide="false"
          ></ContentList>
        </div>
        <div v-show="current.type === 'INFO'" class="info">
          <div class="info-top">
            <div class="info-name">Information</div>
            <div class="info-desc" v-if="current.data">
              {{ current.data.description }}
            </div>
          </div>
          <SnsLinks v-if="current.data" :sns="current.data.sns" />
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import TabItem from './TabItem.vue'
import ContentList from '../contents_v2/ContentList.vue'
import SnsLinks from '../projects/SnsLinks.vue'
import SortDropdown from '../util/SortDropdown.vue'

export default {
  name: 'ProjectTab',
  components: {
    TabItem,
    ContentList,
    SnsLinks,
    SortDropdown,
  },
  props: {
    tabs: {
      type: Array,
      default: () => [],
    },
    width: {
      type: Number,
      default: window.innerWidth,
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

  .sort {
    position: relative;
    margin-left: auto;
  }
}

.info {
  .info-top {
    .info-name {
      font-family: 'Pretendard';
      font-style: normal;
      font-weight: 600;
      font-size: 18px;

      color: #000000;
    }
    .info-desc {
      font-family: 'Pretendard';
      font-style: normal;
      font-weight: 400;
      font-size: 16px;

      color: #4d4d4d;
    }
  }
}
</style>
