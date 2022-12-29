<template>
  <div>
    <div class="header">
      <div class="background" :style="{ background: backgroundColor }"></div>
      <div class="user-info">
        <ProjectPageProfile class="profile"></ProjectPageProfile>
        <div class="buttons">
          <div class="round-button">
            <img src="../../assets/icons/share.svg" />
          </div>
          <div class="round-button">
            <img src="../../assets/icons/launch.svg" />
          </div>
          <div
            class="round-button"
            @mousedown="moreMouseDown"
            @mouseup="moreMouseUp"
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
                v-show="project.owner === currentUser.wallet_address"
                :to="{
                  name: 'ProjectSettings',
                  params: { project_address: project.id },
                }"
              >
                Edit Project
              </router-link>
              <div slot="body">Report</div>
            </BasicDialog>
          </div>
          <div v-if="this.width >= 1080" class="creators-button">
            <div class="creator">Creator</div>
            <ContentsProfileBundle class="profile-bundle" />
            <div class="viewAll">View all</div>
          </div>
        </div>
      </div>
    </div>
    <div class="tab-n-content">
      <div class="bottom">
        <div class="tab" v-if="this.width < 1440">
          <div class="red-button">Art</div>
          <div class="collection-name">Collection name</div>
          <ContentsProfile class="contents-profile" />
          <div class="statistic-container">
            <div
              class="statistic"
              v-for="(item, index) in projectData"
              :key="index"
            >
              <div class="name">{{ item.name }}</div>
              <div class="info">{{ item.info }}</div>
            </div>
          </div>
        </div>
        <LeftProjectTab
          v-else-if="this.width >= 1440"
          :sns="project.sns"
          class="left-tab"
        />
      </div>
      <ProjectTabSort :tabs="tabs" :width="width" class="project-tab-sort" />
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
    {{ project }}
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { backgroundColor } from '../../mixin'
import { graphql, queryProject, queryTokensByProject } from '../../api/graphql'
import { getTobeApprovedContents } from '../../api/contents'
import ProjectPageProfile from '../profile/ProjectPageProfile.vue'
import MintModal from '../modal/MintModal.vue'
import MintStep0 from '../modal/mint_steps/MintStep0.vue'
import MintStep1 from '../modal/mint_steps/MintStep1.vue'
import MintStep2 from '../modal/mint_steps/MintStep2.vue'
import MintStep3 from '../modal/mint_steps/MintStep3.vue'
import MintStepFinal from '../modal/mint_steps/MintStepFinal.vue'
import MintStepMinting from '../modal/mint_steps/MintStepMinting.vue'
import ProjectTabSort from '../tabs/ProjectTabSort.vue'
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
    ProjectTabSort,
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
  },
  data() {
    return {
      projectAddress: '',
      backgroundColor: null,
      project: {},
      tabs: [
        { id: 0, type: 'CONTENTS', label: 'Tokens', api: {} },
        { id: 1, type: 'CONTENTS', label: 'Waiting For Approval', api: {} },
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
      projectData: [
        { name: 'Items', info: '235/1000' },
        { name: 'Subscirber', info: '2,000' },
        { name: 'Floor price', info: '0.001 ETH' },
        { name: 'Total sales', info: '12K ETH' },
      ],
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
      this.isMouseDownOnMore = true
    },
    moreMouseUp() {
      this.isMouseUpOnMore = true
      if (this.isMouseDownOnMore) {
        this.isDialogActive = true
      }
    },
  },
  async created() {
    this.projectAddress = this.$route.params.id
    this.backgroundColor = this.generateGradientBackground(
      this.$route.params.id,
    )
    this.project = await this.getProject()

    this.tabs[0].api = {
      func: graphql,
      body: queryTokensByProject({
        variables: {
          first: 10,
          skip: 0,
          project: this.$route.params.id,
        },
      }),
    }

    this.tabs[1].api = {
      func: getTobeApprovedContents,
      pathParams: { projectId: this.$route.params.id },
      queryParams: { start_num: 0, count_num: 5 },
    }

    this.tabs[2].data = {
      description: this.project.description,
      sns: this.project.sns,
    }

    this.$watch(
      () => this.$route,
      async to => {
        if (to.name === 'Project' && !to.query.tab) {
          this.project = await this.getProject()
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
      }

      switch (to.query.tab || '0') {
        case '0':
          this.tabs[0].api = {
            func: graphql,
            body: queryTokensByProject({
              variables: {
                first: 10,
                skip: 0,
                project: to.params.id,
              },
            }),
          }
          break
        case '1':
          this.tabs[1].api = {
            func: getTobeApprovedContents,
            pathParams: { projectId: to.params.id },
            queryParams: { start_num: 0, count_num: 5 },
          }
          break
        case '2':
          this.tabs[2].data = {
            description: this.project.description,
            sns: this.project.sns,
          }
          break
        default:
          break
      }
    },
    isDialogActive(val) {
      if (val) {
        this.$nextTick(() => this.$refs.dialog.$el.focus())
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/variables';

.header {
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
      .round-button {
        width: 48px;
        height: 48px;
        background: #ffffff;
        border: 1px solid #f2f2f2;
        box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.08);
        border-radius: 999px;
        display: flex;
        justify-content: center;
        align-items: center;
        img {
          position: absolute;
        }

        .dialog {
          display: none;
          &.active {
            display: block;
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
      .collection-name {
        font-family: 'Pretendard';
        font-style: normal;
        font-weight: 700;
        font-size: 24px;
        color: #000000;
        text-align: left;
        margin-top: 8px;
      }
      .contents-profile {
        margin-top: 8px;
      }
      .statistic-container {
        display: flex;
        margin-top: 16px;
        justify-content: space-around;
        margin-bottom: 24px;
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
            margin-top: 8px;
          }
        }
      }

      // .info {
      //   margin-top: 8px;
      //   font-family: 'Pretendard';
      //   font-style: normal;
      //   font-weight: 600;
      //   font-size: 18px;
      //   text-align: left;
      //   color: #000000;
      // }
      // .desc {
      //   text-align: left;
      //   margin-top: 8px;
      //   font-family: 'Pretendard';
      //   font-style: normal;
      //   font-weight: 400;
      //   font-size: 16px;
      //   color: #4d4d4d;
      //   line-height: 150%;
      // }
      // .project-info {
      //   width: 100%;
      //   height: 48px;

      //   border-radius: 5px;

      //   margin-top: 8px;
      //   margin-bottom: 24px;
      // }
    }
    .left-tab {
      margin-left: 185px;
    }
    .contents {
      padding: 0 10%;
    }
  }
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
// if width is larger than 1440 then change the display
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
