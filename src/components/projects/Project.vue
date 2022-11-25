<template>
  <div>
    <div class="header">
      <div class="background" :style="{'background': backgroundColor}"></div>
      <div class="user-info">
        <project-page-profile></project-page-profile>
      </div>
      <div class="tab">
      </div>
    </div>
    <basic-modal v-if="isModalOpen">
      <span slot="header" class="modal_header" @click="close">X</span>
      <mint-token slot="body" :projectInfo="projectInfo"></mint-token>
    </basic-modal>
    <project-tab :tabs="tabs"/>
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

export default {
  name: 'Project',
  mixins: [backgroundColor],
  components: {
    ProjectPageProfile, BasicModal, MintToken, ProjectTab
  },
  computed: {
    ...mapState({
      isModalOpen: state => state.menu.isModalOpen
    })
  },
  data() {
    return {
      projectAddress: '',
      backgroundColor: null,
      projectInfo: {},
      tabs: [
        { id: 0, type:'CONTENTS', label: 'Tokens', api: {} },
        { id: 1, type:'CONTENTS', label: 'Waiting For Approval', api: {} },
      ]
    }
  },
  methods: {
    async getProject() {
      const projectInfo = await graphql(queryProject({
        variables: {
          id: this.projectAddress
        }
      }))
      return projectInfo
    },
    close() {
      this.toggleModal()
    },
    toggleModal() {
      this.$store.commit('TOGGLE_MODAL')
    },
  },
  async created() {
    this.projectAddress = this.$route.params.id
    this.backgroundColor = this.generateGradientBackground(this.$route.params.id)
    this.projectInfo = await this.getProject()

    this.tabs[0].api = {
      func: graphql,
      body: queryTokensByProject({
        variables: {
          first: 10,
          skip: 0,
          project: this.$route.params.id,
        }
      })
    }

    this.tabs[1].api = {
      func: getTobeApprovedContents,
      pathParams: { projectId: this.$route.params.id },
      queryParams: { start_num: 0, count_num: 5 }
    }

    this.$watch(
      () => this.$route,
      async () => {
        if (this.projectAddress) {
          this.projectInfo = await this.getProject()
        }
      }
    )
  },
  mounted() {
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
              }
            })
          }
          break;
        case '1':
          this.tabs[1].api = {
            func: getTobeApprovedContents,
            pathParams: { projectId: to.params.id },
            queryParams: { start_num: 0, count_num: 5 }
          }
          break;
        default:
          break;
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/variables';

.header {
  .background {
    height: 15em;
  }
  .user-info {
    height: 30%;
    button {
      padding: 10px;
      border-radius: 10px;
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
      display: flex;
      justify-content: center;

      button {
        border-radius: 10px;
      }
    }
  }

  .contents {
    padding: 0;
  }
}
</style>
