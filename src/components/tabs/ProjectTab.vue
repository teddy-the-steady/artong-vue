<template>
  <div class="container">
    <SortDropdown
      class="sort"
      :sortOptions="sortOptions"
      :sortSelected="current.sort"
    ></SortDropdown>
    <div class="tabs">
      <TabItem
        v-for="tab in tabs"
        v-bind="tab"
        :key="tab.id"
        v-model="currentId"
        @tabClick="tabClick"
        v-show="
          (tab.show && tab.type !== 'INFO') ||
          (tab.type === 'INFO' && width < 1440)
        "
      />
    </div>
    <div class="items">
      <section class="item" :key="generateKey()">
        <div v-show="current.type === 'CONTENTS' && current.show">
          <ContentList
            :queryContents="current.api"
            :windowWide="false"
          ></ContentList>
        </div>
        <div v-show="current.type === 'PROFILES' && current.show">
          <ProfileList :apiProfiles="current.api"></ProfileList>
        </div>
        <div v-show="current.type === 'INFO' && current.show" class="info">
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
import ProfileList from '../profile/ProfileList.vue'
import SnsLinks from '../projects/SnsLinks.vue'
import SortDropdown from '../util/SortDropdown.vue'

export default {
  name: 'ProjectTab',
  components: {
    TabItem,
    ContentList,
    ProfileList,
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
      return this.currentId + this.current.sort?.name
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
  .sort {
    text-align: initial;
    float: right;
    position: relative;
    transform: translate(-10px, 40px);
    z-index: 1;
  }
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
        width: 80%;
        word-break: break-word;
        margin: auto;
      }
    }
  }
}
@media (min-width: 1440px) {
  .container {
    .tabs {
      padding-right: 0px;
      box-sizing: initial;
    }
  }
}
</style>
