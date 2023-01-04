<template>
  <div>
    <div class="header">
      <div class="background" :style="{ background: backgroundColor }"></div>
      <div class="user-info">
        <ProjectPageProfile class="profile"></ProjectPageProfile>
        <div class="buttons">
          <button class="round-button ripple" @click="share">
            <img src="../../assets/icons/share.svg" />
          </button>
          <button class="round-button ripple" @click="toEtherscan">
            <img src="../../assets/icons/launch.svg" />
          </button>
          <button
            class="round-button ripple"
            @mousedown="moreMouseDown"
            @mouseup="moreMouseUp"
            @touchstart="moreTouchStart"
            @touchend="moreTouchEnd"
          >
            <img src="../../assets/icons/more.svg" />
            <BasicDialog
              class="dialog"
              :class="{ active: isDialogActive }"
              @dialog-focus-out="closeDialog"
              ref="dialog"
            >
              <router-link
                slot="body"
                tag="div"
                v-show="
                  project.owner
                    ? project.owner.wallet_address ===
                      currentUser.wallet_address
                    : false
                "
                :to="{
                  name: 'ProjectSettings',
                  params: { project_address: project.id },
                }"
              >
                Edit Project
              </router-link>
              <div slot="body">Report</div>
            </BasicDialog>
          </button>
          <div v-if="this.width >= 1080" class="creators-button">
            <div class="creator">Creator</div>
            <ContentsProfileBundle
              class="profile-bundle"
              :members="project.contributors"
            />
            <div class="viewAll">View all</div>
          </div>
        </div>
      </div>
    </div>
    <div class="tab-n-content">
      <div class="bottom">
        <div class="tab" v-if="this.width < 1440">
          <div class="red-button">
            {{ project.symbol ? project.symbol.toUpperCase() : '' }}
          </div>
          <div class="container1">
            <div class="collection-name">{{ project.name }}</div>
            <div class="statistic-container">
              <div
                class="statistic"
                v-for="(item, index) in projectData"
                :key="index"
              >
                <!-- <div class="name">{{ item.name }}</div> -->
                <div class="info">{{ item.info }}</div>
              </div>
            </div>
          </div>
          <button
            v-if="project.is_subscriber"
            @click="unsubscribe"
            class="subscribe-n-unsubscribe-button"
          >
            Unsubscribe {{ this.project.subscribers }}
          </button>
          <button
            v-else
            @click="subscribe"
            class="subscribe-n-unsubscribe-button"
          >
            Subscribe {{ this.project.subscribers }}
          </button>
          <div class="people-container">
            <div class="people-inner-container">
              <div class="title">Owned by</div>
              <router-link
                :to="{
                  name: 'UserOrArtist',
                  params: { id: project.owner.username },
                }"
              >
                <ContentsProfile
                  class="contents-profile"
                  :member="project.owner"
                />
              </router-link>
            </div>
            <div class="people-inner-container">
              <div class="title">Created by</div>
              <ContentsProfileBundle
                class="profile-bundle"
                :members="project.contributors"
              />
            </div>
          </div>
        </div>
        <LeftProjectTab
          v-else-if="this.width >= 1440"
          :project="project"
          class="left-tab"
        />
      </div>
      <ProjectTab
        :tabs="tabs"
        :width="width"
        :sortOptions="sortOptions"
        :tabsLength="tabs.length"
        class="project-tab-sort"
      />
    </div>
    <MintModal v-if="isModalOpen" :steps="steps" :slotData="slotData">
      <span slot="header" @click="close">X</span>
      <MintStep0
        slot="body_step_0"
        @data-from-step0="setSlotData"
        :project="project"
      ></MintStep0>
      <MintStep1 slot="body_step_1" @data-from-step1="setSlotData"></MintStep1>
      <MintStep2 slot="body_step_2" @data-from-step2="setSlotData"></MintStep2>
      <MintStep3
        slot="body_step_3"
        @data-from-step3="setSlotData"
        :project="project"
        :slotData="slotData"
        slot-scope="slotData"
      ></MintStep3>
      <MintStepFinal
        slot="body_step_4"
        :project="project"
        :slotData="slotData"
        slot-scope="slotData"
      ></MintStepFinal>
      <MintStepMinting slot="body_step_5"></MintStepMinting>
    </MintModal>
    <textarea v-model="url" ref="url"></textarea>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { backgroundColor } from '../../mixin'
import { graphql, queryProject, queryTokensByProject } from '../../api/graphql'
import {
  postProjectSubscriber,
  getProjectContributors,
} from '../../api/projects'
import { getTobeApprovedContents } from '../../api/contents'
import ProjectPageProfile from '../profile/ProjectPageProfile.vue'
import MintModal from '../modal/MintModal.vue'
import MintStep0 from '../modal/mint_steps/MintStep0.vue'
import MintStep1 from '../modal/mint_steps/MintStep1.vue'
import MintStep2 from '../modal/mint_steps/MintStep2.vue'
import MintStep3 from '../modal/mint_steps/MintStep3.vue'
import MintStepFinal from '../modal/mint_steps/MintStepFinal.vue'
import MintStepMinting from '../modal/mint_steps/MintStepMinting.vue'
import ProjectTab from '../tabs/ProjectTab.vue'
import ContentsProfileBundle from '../profile/ContentsProfileBundle.vue'
import LeftProjectTab from '../tabs/LeftProjectTab.vue'
import ContentsProfile from '../profile/ContentsProfile.vue'
import BasicDialog from '../dialog/BasicDialog.vue'

export default {
  name: 'Project',
  mixins: [backgroundColor],
  components: {
    ProjectPageProfile,
    MintModal,
    MintStep0,
    MintStep1,
    MintStep2,
    MintStep3,
    MintStepFinal,
    MintStepMinting,
    ProjectTab,
    ContentsProfileBundle,
    LeftProjectTab,
    ContentsProfile,
    BasicDialog,
  },
  computed: {
    ...mapState({
      isModalOpen: state => state.menu.isModalOpen,
      currentUser: state => state.user.currentUser,
    }),

    isMobile() {
      return this.$isMobile()
    },
  },
  data() {
    return {
      projectAddress: '',
      backgroundColor: null,
      project: {},
      tabs: [
        { id: 0, type: 'CONTENTS', label: 'Tokens', api: {}, sort: {} },
        { id: 1, type: 'PROFILES', label: 'Contributors', api: {}, sort: {} },
        { id: 2, type: 'INFO', label: 'Info', data: {} },
      ],
      width: window.innerWidth,
      steps: [
        { id: 0, title: 'stepModal0' },
        { id: 1, title: 'stepModal1' },
        { id: 2, title: 'stepModal2' },
        { id: 3, title: 'stepModal3' },
        { id: 4, title: 'stepModalFinal' },
        { id: 5, title: 'stepModalMinting' },
      ],
      slotData: { lazyMint: 1 },
      isDialogActive: false,
      isMouseDownOnMore: false,
      isMouseUpOnMore: false,
      projectData: [],
      url: '',
      sortOptions: {
        newest: {
          name: 'Newest',
          orderBy: 'createdAt',
          orderDirection: 'desc',
        },
        oldest: {
          name: 'Oldest',
          orderBy: 'createdAt',
          orderDirection: 'asc',
        },
      },
    }
  },
  methods: {
    async getProject() {
      const result = await graphql(
        queryProject({
          variables: {
            id: this.projectAddress,
          },
        }),
      )
      return result.project
    },
    close() {
      this.slotData = { lazyMint: 1 }
      this.toggleModal()
    },
    toggleModal() {
      this.$store.commit('TOGGLE_MODAL')
    },
    setWidth() {
      this.width = window.innerWidth
    },
    setSlotData(key, val) {
      this.slotData[key] = val
    },
    closeDialog() {
      this.isDialogActive = false
      this.isMouseDownOnMore = false
      this.isMouseUpOnMore = false
    },
    moreMouseDown() {
      if (!this.isMobile) {
        this.isMouseDownOnMore = true
      }
    },
    moreMouseUp() {
      if (!this.isMobile) {
        this.isMouseUpOnMore = true
        if (this.isMouseDownOnMore) {
          this.isDialogActive = true
        }
      }
    },
    moreTouchStart() {
      if (this.isMobile) {
        this.isMouseDownSort = true
      }
    },
    moreTouchEnd() {
      if (this.isMobile) {
        this.isMouseUpSort = true
        if (this.isDialogActive) {
          this.isDialogActive = false
          return
        }
        if (this.isMouseDownSort) {
          this.isDialogActive = true
        }
      }
    },
    getURL() {
      this.url = window.location.href
    },
    share() {
      if (this.isMobile) {
        if (navigator.share) {
          navigator.share({
            title: 'artong',
            url: this.url,
          })
        } else {
          alert('공유하기가 지원되지 않는 환경입니다.')
        }
      } else {
        this.getURL()
        const element = this.$refs.url
        element.select()
        document.execCommand('copy')
        alert('링크 복사 완료')
      }
    },
    toEtherscan() {
      if (process.env.NODE_ENV == 'production') {
        window.open('https://etherscan.io/address/' + this.project.id)
      } else {
        window.open('https://goerli.etherscan.io/address/' + this.project.id)
      }
    },
    setStatistics() {
      this.projectData[0] = {
        name: 'Items',
        info: `${this.project.max_token_id || 0}/${this.project.maxAmount}`,
      }
    },
    async subscribe() {
      try {
        await postProjectSubscriber({
          isSubscribeRequest: true,
          targetProjectAddress: this.project.id,
        })
        this.project.subscribers = String(
          parseInt(this.project.subscribers) + 1,
        )
        this.project.is_subscriber = true
      } catch (error) {
        console.log('error 발생')
      }
    },
    async unsubscribe() {
      try {
        await postProjectSubscriber({
          isSubscribeRequest: false,
          targetProjectAddress: this.project.id,
        })
        this.project.subscribers = String(
          parseInt(this.project.subscribers) - 1,
        )
        this.project.is_subscriber = false
      } catch (error) {
        console.log('error 발생')
      }
    },
    setTabs() {
      this.tabs[0].sort =
        this.sortOptions[this.$route.query.sort] || this.sortOptions['newest']
      this.tabs[0].api = {
        func: graphql,
        body: queryTokensByProject({
          variables: {
            first: 10,
            skip: 0,
            project: this.$route.params.id,
            orderBy: this.tabs[0].sort.orderBy,
            orderDirection: this.tabs[0].sort.orderDirection,
          },
        }),
      }

      this.tabs[1].api = {
        func: getProjectContributors,
        pathParams: { address: this.$route.params.id },
        queryParams: { start_num: 0, count_num: 5 },
      }

      this.tabs[2].data = {
        description: this.project.description,
        sns: this.project.sns,
      }
    },
    setConditionalTabs() {
      if (this.project.policy === 1) {
        if (
          this.currentUser.wallet_address ===
            this.project.owner.wallet_address ||
          this.project.is_contributor
        ) {
          this.tabs[3] = {
            id: 3,
            type: 'CONTENTS',
            label: 'Waiting for Apporval',
            api: {
              func: getTobeApprovedContents,
              pathParams: { address: this.projectAddress },
              queryParams: { start_num: 0, count_num: 5 },
            },
            sort: {},
          }
          console.log('Waiting for apporval added')
        } else {
          this.tabs.length = 3
        }
      } else {
        this.tabs.length = 3
      }
    },
  },
  async created() {
    this.projectAddress = this.$route.params.id
    this.backgroundColor = this.generateGradientBackground(
      this.$route.params.id,
    )
    this.project = await this.getProject()
    this.setStatistics()
    this.setTabs()
    this.setConditionalTabs()

    this.$watch(
      () => this.$route,
      async to => {
        if (to.name === 'Project' && (!to.query.tab || to.query.tab == 0)) {
          this.project = await this.getProject()
          this.setStatistics()
          this.setConditionalTabs()
        }
      },
    )
  },
  mounted() {
    window.addEventListener('resize', this.setWidth)
    this.$root.$on('contribute', () => {
      this.toggleModal()
    })
  },
  watch: {
    $route(to) {
      if (this.projectAddress !== to.params.id) {
        this.projectAddress = to.params.id
        this.backgroundColor = this.generateGradientBackground(to.params.id)
        this.tabs.length = 3
      }

      const t = to.query.tab || '0'
      switch (t) {
        case '0':
          this.tabs[t].sort =
            this.sortOptions[to.query.sort] || this.sortOptions['newest']
          this.tabs[t].api = {
            func: graphql,
            body: queryTokensByProject({
              variables: {
                first: 10,
                skip: 0,
                project: to.params.id,
                orderBy: this.tabs[t].sort.orderBy,
                orderDirection: this.tabs[t].sort.orderDirection,
              },
            }),
          }
          break
        case '1':
          this.tabs[t].api = {
            func: getProjectContributors,
            pathParams: { address: to.params.id },
            queryParams: { start_num: 0, count_num: 5 },
          }
          break
        case '2':
          this.tabs[t].data = {
            description: this.project.description,
            sns: this.project.sns,
          }
          break
        default:
          break
      }
    },
    isDialogActive() {
      if (!this.isMobile) {
        this.$nextTick(() => this.$refs.dialog.$el.focus())
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/variables';

.header {
  position: relative;
  z-index: 2;
  .background {
    height: 330px;
  }
  .user-info {
    height: 30%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .profile {
      transform: translateY(-60px);
      margin-left: 16px;
    }
    .buttons {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      transform: translateY(-24px);
      margin-right: 16px;
      width: 160px;

      img {
        position: absolute;
      }

      button {
        .dialog {
          display: none;
          top: 110%;
          &.active {
            display: block;
          }
        }
      }
    }
    .creators-button {
      width: 258px;
      height: 48px;
      background: #ffffff;
      border: 1px solid #f2f2f2;
      box-shadow: 2px 2px 12px rgba(0, 0, 0, 0.14);
      border-radius: 999px;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      .creator {
        font-family: 'Pretendard';
        font-style: normal;
        font-weight: 500;
        font-size: 14px;
        color: #000000;
      }
      .profile-bundle {
        margin-bottom: 0px;
        margin-left: 6px;
        transform: translateX(5px);
      }
      .viewAll {
        font-family: 'Pretendard';
        font-style: normal;
        font-weight: 400;
        font-size: 12px;
        color: #808080;
      }
    }
  }
}
.tab-n-content {
  .bottom {
    .tab {
      padding-left: 24px;
      padding-right: 24px;
      .red-button {
        width: 52px;
        height: 25px;
        border: 1px solid #f22e3e;
        border-radius: 999px;
        font-family: 'Pretendard';
        font-style: normal;
        font-weight: 500;
        font-size: 14px;
        color: #f22e3e;
        line-height: 25px;
      }
      .container1 {
        display: flex;
        .collection-name {
          font-family: 'Pretendard';
          font-style: normal;
          font-weight: 700;
          font-size: 24px;
          color: #000000;
          text-align: left;
          margin-top: 8px;
        }
        .statistic-container {
          display: flex;
          //sjustify-content: space-around;
          align-items: center;
          margin-left: 4px;
          margin-top: 2px;
          .statistic {
            .name {
              font-family: 'Pretendard';
              font-style: normal;
              font-weight: 600;
              font-size: 14px;
            }
            .info {
              font-family: 'Pretendard';
              font-style: normal;
              font-weight: 400;
              font-size: 15px;
              color: #4d4d4d;
            }
          }
        }
      }
      .subscribe-n-unsubscribe-button {
        width: 100%;
        height: 47px;
        margin-top: 24px;
        margin-bottom: 24px;
      }
      .people-container {
        .people-inner-container {
          margin-top: 16px;
          .title {
            font-family: 'Pretendard';
            font-style: normal;
            font-weight: 600;
            font-size: 18px;
            color: $artong-black;
            text-align: initial;
            margin-bottom: 8px;
          }
          .contents-profile {
          }
        }
      }
    }
    .left-tab {
      margin-left: 185px;
    }
    .contents {
      padding: 0 10%;
    }
  }
  .project-tab-sort {
    width: 100%;
  }
}
textarea {
  opacity: 0;
  height: 0px;
  width: 0px;
}

@media only screen and (max-width: 599px) {
  .header {
    .user-info {
    }
  }

  .contents {
    padding: 0;
  }
}
@media only screen and (min-width: 1080px) {
  .header {
    .user-info {
      .profile {
      }
      .buttons {
        width: 426px;
      }
    }
  }
}
@media only screen and (min-width: 1440px) {
  .tab-n-content {
    display: flex;
    margin-right: 185px;
    .bottom {
      display: flex;
      flex-direction: row;
      .left-tab {
        margin-left: 185px;
      }
    }
  }
}
@media only screen and (min-width: 1920px) {
  .header {
    .user-info {
      .profile {
        margin-left: 240px;
      }
      .buttons {
        margin-right: 24px;
        width: 426px;
      }
    }
  }
  .tab-n-content {
    margin-right: 240px;
    .bottom {
      .left-tab {
        margin-left: 240px;
      }
    }
  }
}
</style>
