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
    <mint-modal v-if="isModalOpen">
      <span slot="header" class="modal_header" @click="close">X</span>
      <mint-token slot="body" :projectInfo="projectInfo"></mint-token>
    </mint-modal>
    <project-tab :tabs="tabs"/>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { backgroundColor } from '../../mixin'
import { graphql, queryProject, queryTokensByProject } from '../../api/graphql'
import { getTobeApprovedContents } from '../../api/contents'
import ProjectPageProfile from '../profile/ProjectPageProfile.vue'
import MintModal from '../modal/MintModal.vue'
import MintToken from '../projects/MintToken.vue'
import ProjectTab from '../tabs/ProjectTab.vue'

export default {
  name: 'Project',
  mixins: [backgroundColor],
  components: {
    ProjectPageProfile, MintModal, MintToken, ProjectTab
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
    this.projectInfo = await graphql(queryProject({
      variables: {
        id: this.projectAddress
      }
    }))

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
          this.projectInfo = await graphql(queryProject({
            variables: {
              id: this.projectAddress
            }
          }))
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
    $route(val) {
      if (this.projectAddress !== val.params.id) {
        this.projectAddress = val.params.id
        this.backgroundColor = this.generateGradientBackground(val.params.id)
      }

      switch (val.query.tab || '0') {
        case '0':
          this.tabs[0].api = {
            func: graphql,
            body: queryTokensByProject({
              variables: {
                first: 10,
                skip: 0,
                project: val.params.id,
              }
            })
          }
          break;
        case '1':
          this.tabs[1].api = {
            func: getTobeApprovedContents,
            pathParams: { projectId: val.params.id },
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
