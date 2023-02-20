<template>
  <div>
    <div class="header">
      <div v-if="isFirstLoading" class="background">
        <SkeletonBox style="width: 100%; height: 100%"></SkeletonBox>
      </div>
      <div v-else class="background" :style="{ background: backgroundColor }">
        <img
          v-if="project"
          :src="backgroundImage"
          class="background-image"
          :class="{ pointer: isProjectOwner }"
          @click="backgroundClick"
        />
        <input ref="fileInput" type="file" @change="onFileChange" />
      </div>
      <div class="user-info">
        <ProjectPageProfile
          class="profile"
          :project="project"
          :isFirstLoading="isFirstLoading"
        ></ProjectPageProfile>
        <div class="buttons">
          <button class="white-button round-button ripple" @click="share">
            <img src="../../assets/icons/share.svg" />
          </button>
          <button class="white-button round-button ripple" @click="toEtherscan">
            <img src="../../assets/icons/launch.svg" />
          </button>
          <button
            class="white-button round-button ripple"
            @mousedown="moreMouseDown"
            @mouseup="moreMouseUp"
            @touchstart="moreTouchStart"
            @touchend="moreTouchEnd"
          >
            <img src="../../assets/icons/more.svg" />
          </button>
          <BasicDialog
            class="dialog"
            :class="{ active: isDialogActive }"
            @dialog-focus-out="closeDialog"
            ref="dialog"
          >
            <div
              slot="body"
              @click="editProject"
              v-show="
                project.owner
                  ? project.owner.wallet_address === currentUser.wallet_address
                  : false
              "
            >
              {{ $t('views.project.more-modal.edit-project') }}
            </div>
            <!-- </router-link> -->
            <div slot="body">{{ $t('views.project.more-modal.report') }}</div>
          </BasicDialog>
          <div v-if="innerWidth >= 1080" class="creators-button">
            <div class="creator">
              {{ $t('views.project.creator.created-by') }}
            </div>
            <ContentsProfileBundle
              class="profile-bundle"
              :members="project.contributors"
              :isFirstLoading="isFirstLoading"
            />
            <div class="viewAll" @click="gotoContributorTab">
              {{ $t('views.project.creator.view-all') }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="tab-n-content">
      <div class="bottom">
        <div class="tab" v-if="innerWidth < 1440">
          <div class="symbol-and-slug">
            <div class="symbol">
              {{ project.symbol ? project.symbol.toUpperCase() : '' }}
            </div>
            <div class="slug">{{ project.slug ? `@${project.slug}` : '' }}</div>
          </div>
          <div class="container1">
            <div class="collection-name">{{ project.name }}</div>
            <div class="statistic-container">
              <div
                class="statistic"
                v-for="(item, index) in projectData"
                :key="index"
              >
                <div class="info">{{ item.info }}</div>
              </div>
            </div>
          </div>
          <button
            v-if="project.is_subscriber"
            @click="unsubscribe"
            class="subscribe-n-unsubscribe-button"
            v-ripple
          >
            {{ $t('views.project.buttons.unsubscribe') }}
            {{ this.project.subscribers }}
          </button>
          <button
            v-else
            @click="subscribe"
            class="subscribe-n-unsubscribe-button"
            v-ripple
          >
            {{ $t('views.project.buttons.subscribe') }}
            {{ this.project.subscribers }}
          </button>
          <div class="people-container">
            <div class="people-inner-container">
              <div class="title">
                {{ $t('views.project.creator.owned-by') }}
              </div>
              <router-link
                :to="{
                  name: 'UserOrArtist',
                  params: {
                    id: project.owner ? project.owner.username : '',
                    wallet_address: project.owner
                      ? project.owner.wallet_address
                      : '',
                  },
                }"
              >
                <ContentsProfile
                  class="contents-profile"
                  :member="project.owner"
                  :needUserName="true"
                  :isFirstLoading="isFirstLoading"
                />
              </router-link>
            </div>
            <div class="people-inner-container">
              <div class="title">
                {{ $t('views.project.creator.created-by') }}
              </div>
              <ContentsProfileBundle
                class="profile-bundle"
                :members="project.contributors"
                :isFirstLoading="isFirstLoading"
              />
            </div>
          </div>
        </div>
        <LeftProjectTab
          v-else-if="innerWidth >= 1440"
          :project="project"
          class="left-tab"
        />
      </div>
      <ProjectTab
        :tabs="tabs"
        :sortOptions="sortOptions"
        class="project-tab-sort"
      />
    </div>
    <MintModal
      v-if="isModalOpen"
      :steps="steps"
      :slotData="slotData"
      @close="close"
      @data-from-mint-modal="setSlotData"
    >
      <span slot="header" @click="close">X</span>
      <MintStep0
        slot="body_step_0"
        @data-from-step0="setSlotData"
        :project="project"
      ></MintStep0>
      <MintStep1 slot="body_step_1" @data-from-step1="setSlotData"></MintStep1>
      <MintStep2
        slot="body_step_2"
        @data-from-step2="setSlotData"
        :project="project"
        :slotData="slotData"
        slot-scope="slotData"
      ></MintStep2>
      <MintStep3 slot="body_step_3" @data-from-step3="setSlotData"></MintStep3>
      <MintStepFinal
        slot="body_step_4"
        :project="project"
        :slotData="slotData"
        slot-scope="slotData"
      ></MintStepFinal>
      <MintStepMinting
        slot="body_step_5"
        :uploadedToIPFS="slotData.uploadedToIPFS"
        :minted="slotData.minted"
        :slotData="slotData"
        :project="project"
        @close="close"
      ></MintStepMinting>
    </MintModal>
    <textarea v-model="url" ref="url"></textarea>
  </div>
</template>

<script>
import Storage from '@aws-amplify/storage'
import { mapState } from 'vuex'
import { backgroundColor } from '../../mixin'
import { graphql, queryProject, queryTokensByProject } from '../../api/graphql'
import {
  postProjectSubscriber,
  getProjectContributors,
  patchProject,
} from '../../api/projects'
import { isSessionValid, makeS3Path } from '../../util/commonFunc'
import { getTobeApprovedContents } from '../../api/contents'
import Ripple from '../../directives/ripple/Ripple'
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
import SkeletonBox from '../util/SkeletonBox.vue'

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
    SkeletonBox,
  },
  props: {},
  computed: {
    ...mapState({
      isModalOpen: state => state.menu.isModalOpen,
      currentUser: state => state.user.currentUser,
      innerWidth: state => state.menu.innerWidth,
    }),
    isProjectOwner() {
      return (
        this.currentUser.wallet_address === this.project?.owner?.wallet_address
      )
    },
    isMobile() {
      return this.$isMobile()
    },
    backgroundImage() {
      return makeS3Path(
        this.project.background_s3key ||
          this.project.background_thumbnail_s3key,
      )
    },
    sortOptions() {
      return {
        newest: {
          name: this.$i18n.t('views.project.sort-options.newest'),
          orderBy: 'createdAt',
          orderDirection: 'desc',
        },
        oldest: {
          name: this.$i18n.t('views.project.sort-options.oldest'),
          orderBy: 'createdAt',
          orderDirection: 'asc',
        },
      }
    },
  },
  data() {
    return {
      projectAddressOrSlug: '',
      backgroundColor: null,
      project: {},
      tabs: [
        {
          id: 0,
          type: 'CONTENTS',
          label: this.$i18n.t('views.project.tabs.tokens'),
          api: {},
          sort: {},
        },
        {
          id: 1,
          type: 'PROFILES',
          label: this.$i18n.t('views.project.tabs.contributors'),
          api: {},
          sort: {},
        },
        {
          id: 2,
          type: 'INFO',
          label: this.$i18n.t('views.project.tabs.info.title'),
          data: {},
        },
      ],
      steps: [
        { id: 0, title: 'stepModal0' },
        { id: 1, title: 'stepModal1' },
        { id: 2, title: 'stepModal2' },
        { id: 3, title: 'stepModal3' },
        { id: 4, title: 'stepModalFinal' },
        { id: 5, title: 'stepModalMinting' },
      ],
      slotData: {
        lazyMint: 1,
        uploadingToS3: false,
        uploadedToIPFS: false,
        minted: false,
      },
      isDialogActive: false,
      isMouseDownOnMore: false,
      isMouseUpOnMore: false,
      isFirstLoading: true,
      projectData: [],
      url: '',
      S3_PRIVACY_LEVEL: 'public',
      loadingData: {
        finishedUploading: false,
        finishedMinting: false,
      },
    }
  },
  methods: {
    setLoadingData(key, value) {
      this.loadingData[key] = value
    },
    sleep(timeToDelay) {
      return new Promise(resolve => setTimeout(resolve, timeToDelay))
    },
    async getProject() {
      for (;;) {
        const result = await graphql(
          queryProject({
            variables: {
              id: this.projectAddressOrSlug,
            },
          }),
        )
        if (result.data.project) {
          return result.data.project
        }
        if (this.$router.currentRoute.name !== 'Project') {
          break
        }
        if (result.data.retry) {
          await this.sleep(3000)
        }
      }
    },
    close() {
      this.slotData = {
        lazyMint: 1,
        uploadingToS3: false,
        uploadedToIPFS: false,
        minted: false,
      }
      this.toggleModal()
    },
    toggleModal() {
      this.$store.commit('TOGGLE_MODAL')
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
        this.isMouseDownOnMore = true
      }
    },
    moreTouchEnd() {
      if (this.isMobile) {
        this.isMouseUpOnMore = true
        if (this.isDialogActive) {
          this.isDialogActive = false
          return
        }
        if (this.isMouseDownOnMore) {
          this.isDialogActive = true
        }
      }
    },
    setURL() {
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
          alert(this.$i18n.t('common.alert.error'))
        }
      } else {
        this.setURL()
        const element = this.$refs.url
        element.select()
        document.execCommand('copy')
        alert(this.$i18n.t('common.alert.copy'))
      }
    },
    toEtherscan() {
      window.open(
        `${process.env.VUE_APP_ETHER_SCAN_URL}address/${this.project.id}`,
      )
    },
    setStatistics() {
      this.projectData[0] = {
        name: 'Items',
        info: `${this.project.max_token_id || 0}/${this.project.maxAmount}`,
      }
    },
    async subscribe() {
      if (!(await isSessionValid(this.$router.currentRoute.fullPath))) {
        return
      }
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
            start_num: 0,
            project: this.$route.params.id,
            orderBy: this.tabs[0].sort.orderBy,
            orderDirection: this.tabs[0].sort.orderDirection,
          },
        }),
      }

      this.tabs[1].sort =
        this.sortOptions[this.$route.query.sort] || this.sortOptions['newest']
      this.tabs[1].api = {
        func: getProjectContributors,
        pathParams: { address: this.$route.params.id },
        queryParams: { start_num: 0, count_num: 5 },
      }

      this.tabs[2].data = {
        description: this.project.description,
        sns: this.project.sns,
      }

      if (this.tabs[3]) {
        if (
          this.project.policy === 1 &&
          (this.currentUser.wallet_address ===
            this.project.owner.wallet_address ||
            this.project.is_contributor)
        ) {
          this.tabs[3].sort =
            this.sortOptions[this.$route.query.sort] ||
            this.sortOptions['newest']
          this.tabs[3].api = {
            func: getTobeApprovedContents,
            pathParams: { address: this.project.id },
            queryParams: {
              start_num: 0,
              count_num: 5,
              orderBy: this.tabs[3].sort.orderBy,
              orderDirection: this.tabs[3].sort.orderDirection,
            },
          }
        } else {
          this.tabs[3].api = null
        }
      }
    },
    gotoContributorTab() {
      this.$router.push({
        path: this.$route.path,
        query: { tab: 1 },
      })
    },
    editProject() {
      this.$router.push({
        name: 'ProjectSettings',
        params: { project_address: this.project.id },
      })
    },
    makeS3Path(path) {
      return makeS3Path(path)
    },
    backgroundClick() {
      if (!this.isProjectOwner) {
        return
      }
      this.$refs.fileInput.click()
    },
    async onFileChange(e) {
      const file = e.target.files[0]
      await this.uploadProjectImage(file)
    },
    async uploadProjectImage(file) {
      const result = await Storage.put(
        `project/${this.project.txHash}/background/${file.name}`,
        file,
        {
          level: this.S3_PRIVACY_LEVEL,
          contentType: file.type,
        },
      )
      if (result) {
        const patchResult = await patchProject(this.project.txHash, {
          background_s3key: `${this.S3_PRIVACY_LEVEL}/${result.key}`,
        })
        this.project.background_s3key = patchResult.background_s3key
      }
    },
    setWaitingForApprovalTab() {
      if (this.project.policy === 1) {
        this.$set(this.tabs, 3, {
          id: 3,
          type: 'CONTENTS',
          label: this.$i18n.t('views.project.tabs.waiting-for-approval.title'),
          api: {},
          sort: {},
        })
      } else {
        this.$delete(this.tabs, 3)
      }
    },
  },
  async created() {
    this.projectAddressOrSlug = this.$route.params.id
    this.project = await this.getProject()
    this.setWaitingForApprovalTab()
    this.backgroundColor = this.generateGradientBackground(this.project.id)
    this.isFirstLoading = false
    this.setStatistics()
    this.setTabs()

    this.$watch(
      () => this.$route,
      async to => {
        if (to.name === 'Project' && !to.query.tab) {
          this.project.background_s3key = null
          this.project.background_thumbnail_s3key = null
          this.isFirstLoading = true
          this.project = await this.getProject()
          this.setWaitingForApprovalTab()
          this.backgroundColor = this.generateGradientBackground(
            this.project.id,
          )
          this.isFirstLoading = false
          this.setStatistics()
        }
      },
    )
  },
  mounted() {
    this.$root.$on('contribute', () => {
      this.toggleModal()
    })
  },
  watch: {
    $route(to) {
      if (this.projectAddressOrSlug !== to.params.id) {
        this.projectAddressOrSlug = to.params.id
      }

      this.tabs[0].label = this.$i18n.t('views.project.tabs.tokens')
      this.tabs[1].label = this.$i18n.t('views.project.tabs.contributors')
      this.tabs[2].label = this.$i18n.t('views.project.tabs.info.title')

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
                start_num: 0,
                project: to.params.id,
                orderBy: this.tabs[t].sort.orderBy,
                orderDirection: this.tabs[t].sort.orderDirection,
              },
            }),
          }
          break
        case '1':
          this.tabs[t].sort =
            this.sortOptions[to.query.sort] || this.sortOptions['newest']
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
        case '3':
          if (
            this.project.policy === 1 &&
            (this.currentUser.wallet_address ===
              this.project.owner.wallet_address ||
              this.project.is_contributor)
          ) {
            this.tabs[t].sort =
              this.sortOptions[to.query.sort] || this.sortOptions['newest']
            this.tabs[t].api = {
              func: getTobeApprovedContents,
              pathParams: { address: to.params.id },
              queryParams: {
                start_num: 0,
                count_num: 5,
                orderBy: this.tabs[t].sort.orderBy,
                orderDirection: this.tabs[t].sort.orderDirection,
              },
            }
          } else {
            this.tabs[t].api = null
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
  directives: {
    ripple: Ripple,
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
    .background-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      text-indent: -10000px;
      &.pointer {
        cursor: pointer;
      }
    }
    input[type='file'] {
      display: none;
    }
  }
  .user-info {
    height: 30%;
    display: flex;
    justify-content: space-between;
    .profile {
      transform: translateY(-60px);
      margin-left: 16px;
    }
    .buttons {
      display: flex;
      justify-content: space-between;
      transform: translateY(-24px);
      margin-right: 16px;
      width: 160px;
      height: 100%;

      img {
        position: absolute;
      }

      .dialog {
        display: none;
        &.active {
          display: block;
          top: 110%;
        }
      }
    }
    .creators-button {
      min-width: 265px;
      height: 48px;
      background: #ffffff;
      border: 1px solid #f2f2f2;
      box-shadow: 2px 2px 12px rgba(0, 0, 0, 0.14);
      border-radius: 999px;
      display: flex;
      justify-content: space-around;
      align-items: center;
      padding: 0 10px;
      .creator {
        font-family: 'Pretendard';
        font-style: normal;
        font-weight: 500;
        font-size: 14px;
        color: #000000;
      }
      .profile-bundle {
        margin-bottom: 0px;
        transform: translateX(5px);
      }
      .viewAll {
        font-family: 'Pretendard';
        font-style: normal;
        font-weight: 400;
        font-size: 12px;
        color: #808080;
        cursor: pointer;
      }
    }
  }
}
.tab-n-content {
  .bottom {
    .tab {
      padding-left: 24px;
      padding-right: 24px;
      .symbol-and-slug {
        display: flex;
        align-items: center;
        .symbol {
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
          overflow: hidden !important;
          text-overflow: ellipsis;
        }
        .slug {
          margin-left: 5px;
          color: $darkgray;
          font-style: italic;
        }
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
        width: 100%;
        max-width: 465px;

        .dialog {
          &.active {
            right: 60%;
          }
        }
      }
    }
  }
}
@media only screen and (min-width: 1440px) {
  .header {
    .user-info {
      .profile {
        margin-left: 185px;
      }
    }
  }
  .tab-n-content {
    display: flex;
    margin-right: 185px;
    .bottom {
      display: flex;
      margin-right: 20px;
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
