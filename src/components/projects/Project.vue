<template>
  <div>
    <div class="header">
      <div class="background" :style="{ background: backgroundColor }"></div>
      <div class="user-info">
        <project-page-profile class="profile"></project-page-profile>
        <div class="buttons">
          <div class="round-button">
            <img src="../../assets/icons/share.svg" />
          </div>
          <div class="round-button">
            <img src="../../assets/icons/launch.svg" />
          </div>
          <div class="round-button">
            <img src="../../assets/icons/more.svg" />
          </div>
          <div v-if="this.width >= 1080" class="creators-button">
            <div class="creator">Creator</div>
            <ContentsProfileBundle class="profile-bundle" />
            <div class="viewAll">View all</div>
          </div>
        </div>
      </div>
      <div class="tab"></div>
    </div>
    <basic-modal v-if="isModalOpen">
      <span slot="header" class="modal_header" @click="close">X</span>
      <mint-token slot="body" :projectInfo="projectInfo"></mint-token>
    </basic-modal>
    <project-tab :tabs="tabs" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { backgroundColor } from '../../mixin'
import { graphql, queryProject, queryTokensByProject } from '../../api/graphql'
import { getTobeApprovedContents } from '../../api/contents'
import ProjectPageProfile from '../profile/ProjectPageProfile.vue'
import BasicModal from '../modal/BasicModal.vue'
import MintToken from '../projects/MintToken.vue'
import ProjectTab from '../tabs/ProjectTab.vue'
import ContentsProfileBundle from '../profile/ContentsProfileBundle.vue'

export default {
  name: 'Project',
  mixins: [backgroundColor],
  components: {
    ProjectPageProfile,
    BasicModal,
    MintToken,
    ProjectTab,
    ContentsProfileBundle,
  },
  computed: {
    ...mapState({
      isModalOpen: state => state.menu.isModalOpen,
    }),
  },
  data() {
    return {
      projectAddress: '',
      backgroundColor: null,
      projectInfo: {},
      tabs: [
        { id: 0, type: 'CONTENTS', label: 'Tokens', api: {} },
        { id: 1, type: 'CONTENTS', label: 'Waiting For Approval', api: {} },
      ],
      width: 0,
    }
  },
  methods: {
    async getProject() {
      const projectInfo = await graphql(
        queryProject({
          variables: {
            id: this.projectAddress,
          },
        }),
      )
      return projectInfo
    },
    close() {
      this.toggleModal()
    },
    toggleModal() {
      this.$store.commit('TOGGLE_MODAL')
    },
    setWidth() {
      this.width = window.innerWidth
    },
  },
  async created() {
    this.projectAddress = this.$route.params.id
    this.backgroundColor = this.generateGradientBackground(
      this.$route.params.id,
    )
    this.projectInfo = await this.getProject()

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

    this.$watch(
      () => this.$route,
      async to => {
        if (to.name === 'Project' && this.projectAddress) {
          this.projectInfo = await this.getProject()
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
        default:
          break
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
        // img 중앙정렬
        display: flex;
        justify-content: center;
        img {
          margin-top: auto;
          margin-bottom: auto;
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

  .tab {
    height: 50px;
  }
}

.contents {
  padding: 0 10%;
}

.modal_header {
  cursor: pointer;
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
}
</style>
