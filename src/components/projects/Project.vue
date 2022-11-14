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
    <content-list :queryContents="queryContents"></content-list>
    <mint-modal v-if="isModalOpen">
      <span slot="header" class="modal_header" @click="close">X</span>
      <mint-token slot="body" :projectInfo="projectInfo"></mint-token>
    </mint-modal>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { backgroundColor } from '../../mixin'
import { graphql, queryProject, queryTokensByProject } from '../../api/graphql'
import baseLazyLoading from '../../util/baseLazyLoading'
import ContentList from '../contents_v2/ContentList.vue'
import ProjectPageProfile from '../profile/ProjectPageProfile.vue'
import MintModal from '../modal/MintModal.vue'
import MintToken from '../projects/MintToken.vue'

export default {
  name: 'Project',
  mixins: [backgroundColor],
  components: {
    ContentList, ProjectPageProfile, MintModal, MintToken
  },
  computed: {
    ...mapState({
      isModalOpen: state => state.menu.isModalOpen
    })
  },
  extends: baseLazyLoading(async (to, callback) => {
    const result = await graphql(queryProject({
      variables: {
        id: to.params.id
      }
    }))
    callback(function() {
      this.projectInfo = result.project
    })
  }),
  data() {
    return {
      projectAddress: '',
      backgroundColor: null,
      projectInfo: {},
      queryContents: {}
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
  created() {
    this.projectAddress = this.$route.params.id
    this.backgroundColor = this.generateGradientBackground(this.$route.params.id)

    this.queryContents = {
      func: graphql,
      body: queryTokensByProject({
        variables: {
          first: 10,
          skip: 0,
          project: this.$route.params.id,
        }
      })
    }
  },
  mounted() {
    this.$root.$on('contribute', () => {
      this.toggleModal()
    })
  },
  watch: {
    async $route(val) {
      if (val.name === 'Project') {
        this.projectAddress = val.params.id
        this.backgroundColor = this.generateGradientBackground(val.params.id)

        this.queryContents = {
          func: graphql,
          body: queryTokensByProject({
            variables: {
              first: 10,
              skip: 0,
              project: this.$route.params.id,
            }
          })
        }
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
