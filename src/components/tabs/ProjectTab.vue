<template>
  <div class="container">
    <SortDropdown
      class="sort"
      :sortOptions="sortOptions"
      :sortSelected="current.sort"
    ></SortDropdown>
    <div class="tabs">
      <ProjectTabItem
        v-for="tab in tabs"
        v-bind="tab"
        :key="tab.id"
        v-model="currentId"
        @tabClick="tabClick"
        v-show="
          tab.type !== 'INFO' || (tab.type === 'INFO' && innerWidth < 1440)
        "
        :project="project"
      />
    </div>
    <div class="items">
      <section class="item" :key="generateKey()">
        <div v-show="current.type === 'CONTENTS' && !current.api" class="info">
          <div>
            <button @click="contribute">
              {{ $t('views.project.buttons.contribute') }}
            </button>
            {{ $t('views.project.tabs.waiting-for-approval.redirect-msg') }}
          </div>
        </div>
        <div v-show="current.type === 'CONTENTS' && current.api">
          <ContentList
            :queryContents="current.api"
            :windowWide="false"
          ></ContentList>
        </div>
        <div v-show="current.type === 'PROFILES'">
          <ProfileList :apiProfiles="current.api"></ProfileList>
        </div>
        <div v-show="current.type === 'INFO'" class="info">
          <div class="info-top">
            <div class="info-name">
              {{ $t('views.project.tabs.info.content') }}
            </div>
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
import { isSessionValid } from '../../util/commonFunc'
import ProjectTabItem from './ProjectTabItem.vue'
import ContentList from '../contents_v2/ContentList.vue'
import ProfileList from '../profile/ProfileList.vue'
import SnsLinks from '../projects/SnsLinks.vue'
import SortDropdown from '../dropdown/SortDropdown.vue'

export default {
  name: 'ProjectTab',
  components: {
    ProjectTabItem,
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
    sortOptions: {
      type: Object,
      default: () => {},
    },
    project: {
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
      innerWidth: state => state.menu.innerWidth,
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
    async contribute() {
      if (!(await isSessionValid(this.$router.currentRoute.fullPath))) {
        return
      }
      this.$root.$emit('contribute')
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
    margin: 20px 0;
    font-family: 'Pretendard';
    font-style: normal;
    .info-top {
      .info-name {
        font-weight: 600;
        font-size: 18px;
        margin-bottom: 10px;
      }
      .info-desc {
        font-weight: 400;
        font-size: 16px;
        width: 80%;
        margin: auto;
        white-space: break-spaces;
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
