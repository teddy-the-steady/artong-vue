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
import { backgroundColor } from '../../mixin'
import ContentList from '../contentsV2/ContentList'
import ProjectPageProfile from '../profile/ProjectPageProfile'
import MintModal from '../modal/MintModal'
import MintToken from '../projects/MintToken'
import { graphql } from '../../api/graphql'
import baseLazyLoading from '../../util/baseLazyLoading'
import { mapState } from 'vuex'

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
    const result = await graphql({query: `
      query Project($id: String) {
        project(id: $id) {
          id
          creator
          owner
          name
          symbol
          maxAmount
          policy
          isDisabled
          createdAt
          updatedAt
          _db_project_s3key
          _db_project_thumbnail_s3key
          _db_background_s3key
          _db_background_thumbnail_s3key
        }
      }
      `, variables: { id: to.params.id }
    })
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
      body: {query: `
        query TokensByProject($first: Int, $skip: Int, $project: String) {
          tokens(first: $first, skip: $skip, where: {project: $project}) {
            id
            tokenId
            tokenURI
            contentURI
            creator
            owner
            createdAt
            updatedAt
            _db_voucher
            _db_content_s3key
            _db_content_thumbnail_s3key
            project {
              id
            }
          }
        }
      `, variables: {
          first: 10,
          skip: 0,
          project: this.$route.params.id
        }
      }
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
          body: {query: `
            query TokensByProject($first: Int, $skip: Int, $project: String) {
              tokens(first: $first, skip: $skip, where: {project: $project}) {
                id
                tokenId
                tokenURI
                contentURI
                creator
                owner
                createdAt
                updatedAt
                _db_voucher
                _db_content_s3key
                _db_content_thumbnail_s3key
                project {
                  id
                }
              }
            }
          `, variables: {
              first: 10,
              skip: 0,
              project: val.params.id
            }
          }
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
