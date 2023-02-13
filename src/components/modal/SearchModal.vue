<template>
  <div>
    <div v-if="innerWidth >= 1080" class="search-bar" @click="openSearchModal">
      <img src="../../assets/icons/search-grey.svg" />
      <input
        id="search-input"
        :placeholder="$t('header.search.placeholder')"
        type="text"
        class="search-input"
        :value="searchWord"
        @input="search"
        autocomplete="off"
      />
    </div>
    <transition name="modal" v-if="isSearchModalOpen || openSearchModalSignal">
      <div class="modal-mask">
        <div class="modal-wrapper" @click.self="closeSearchModal">
          <div class="modal-container">
            <div class="modal-header">
              <slot name="header">
                <input
                  id="search-input"
                  :placeholder="$t('header.search.placeholder')"
                  v-if="innerWidth < 1080"
                  :value="searchWord"
                  @input="search"
                  autocomplete="off"
                />
              </slot>
            </div>

            <div class="modal-body">
              <slot v-if="this.searchWord.trimStart().length === 0" name="body">
                <div class="nullSearch">
                  {{ $t('header.search.null-search') }}
                </div>
              </slot>
              <slot v-else name="body">
                <div class="contents">
                  <div class="title">{{ $t('header.search.contents') }}</div>
                  <div class="results">
                    <div
                      @click="closeSearchModal"
                      class="content"
                      v-for="(content, k) in contents"
                      :key="k"
                    >
                      <TokenProfile
                        :token="content"
                        :isFirstLoading="false"
                        @click.native="onContentClick($event, content)"
                      ></TokenProfile>
                    </div>
                  </div>
                </div>
                <div class="projects">
                  <div class="title">{{ $t('header.search.projects') }}</div>
                  <div class="results">
                    <div
                      @click="closeSearchModal"
                      class="project"
                      v-for="(project, k) in projects"
                      :key="k"
                    >
                      <ProjectPageProfile_small
                        :project="project"
                        :isFirstLoading="false"
                      ></ProjectPageProfile_small>
                    </div>
                  </div>
                </div>
                <div class="members">
                  <div class="title">{{ $t('header.search.users') }}</div>
                  <div class="results">
                    <div
                      @click="closeSearchModal"
                      class="member"
                      v-for="(member, k) in members"
                      :key="k"
                    >
                      <router-link
                        :to="{
                          name: 'UserOrArtist',
                          params: {
                            id: member.username,
                          },
                        }"
                      >
                        <ContentsProfile
                          :member="member"
                          :needUserName="true"
                          :isFirstLoading="false"
                        ></ContentsProfile>
                      </router-link>
                    </div>
                  </div>
                </div>
              </slot>
            </div>

            <div class="modal-footer">
              <slot name="footer"> </slot>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { searchContents } from '../../api/contents'
import { searchProjects } from '../../api/projects'
import { searchMembers } from '../../api/member'
import ProjectPageProfile_small from '../profile/ProjectPageProfile_small.vue'
import ContentsProfile from '../profile/ContentsProfile.vue'
import TokenProfile from '../profile/TokenProfile.vue'

export default {
  name: 'BasicModal',
  components: {
    ProjectPageProfile_small,
    ContentsProfile,
    TokenProfile,
  },
  props: {
    openSearchModalSignal: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isSearchModalOpen: false,
      searchWordPast: '',
      searchWord: '',
      contents: [],
      projects: [],
      members: [],
      pastProcessedSearchWordLength: 0,
    }
  },
  computed: {
    ...mapState({
      innerWidth: state => state.menu.innerWidth,
    }),
  },
  methods: {
    async search(event, time = 500) {
      this.searchWord = event.target.value
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        let processedSearchWord = this.searchWord.trimStart()
        if (processedSearchWord) {
          if (
            this.pastProcessedSearchWordLength === processedSearchWord.length
          ) {
            return
          }
          this.makeApiCall(processedSearchWord)
          this.pastProcessedSearchWordLength = processedSearchWord.length
        } else {
          this.contents = []
          this.projects = []
          this.members = []
          this.pastProcessedSearchWordLength = 0
        }
      }, time)
    },
    async makeApiCall(searchWord) {
      const [result1, result2, result3] = await Promise.all([
        searchContents(searchWord),
        searchProjects(searchWord),
        searchMembers(searchWord),
      ])
      this.contents = result1
      this.projects = result2
      this.members = result3
    },
    async searchContents(searchWord) {
      try {
        return await searchContents(searchWord)
      } catch {
        return null
      }
    },
    async searchProjects(searchWord) {
      try {
        return await searchProjects(searchWord)
      } catch {
        return null
      }
    },
    async searchMembers(searchWord) {
      try {
        return await searchMembers(searchWord)
      } catch {
        return null
      }
    },
    openSearchModal() {
      this.isSearchModalOpen = true
    },
    closeSearchModal(event) {
      this.isSearchModalOpen = false
      this.$emit('close-search-modal')
      event.stopPropagation()
    },
    onContentClick(event, val) {
      let imageWidth = 0
      let imageHeight = 0
      if (event.target.className === 'token') {
        const node = event.target.firstChild.firstChild
        imageWidth = node.naturalWidth
        imageHeight = node.naturalHeight
      } else if (event.target.className === 'username') {
        const node = event.target.parentNode.parentNode
        imageWidth = node.firstChild.firstChild.naturalWidth
        imageHeight = node.firstChild.firstChild.naturalHeight
      } else if (event.target.className === 'realImage') {
        imageWidth = event.target.naturalWidth
        imageHeight = event.target.naturalHeight
      }

      if (val.token_id || val.tokenId) {
        this.$router.push({
          name: 'ContentDetail',
          params: {
            project_address: val.slug || val.project_address,
            token_id: val.token_id,
            image_width: imageWidth,
            image_height: imageHeight,
          },
        })
      } else if (val.id) {
        this.$router.push({
          name: 'ContentCandidateDetail',
          params: {
            project_address: val.slug || val.project_address,
            contents_id: val.id,
            image_width: imageWidth,
            image_height: imageHeight,
          },
        })
      }
    },
  },
  watch: {},
  created() {},
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/variables';

.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: $backdrop;
  display: table;
  transition: opacity 0.3s ease;

  .modal-wrapper {
    display: table-cell;
    vertical-align: middle;

    .modal-container {
      box-sizing: border-box;
      padding: 20px 30px;
      background-color: $artong-white;
      transition: all 0.3s ease;
      font-family: Helvetica, Arial, sans-serif;
      position: absolute;
      left: calc(50% - 240px);
      top: 70px;
      width: 480px;
      min-height: 196px;
      box-shadow: 2px 2px 12px rgba(0, 0, 0, 0.14);
      border-radius: 14px;

      .modal-header {
        font-size: 20px;
        color: $lightgray;
        input {
          width: 95%;
          border: none;
          border-bottom: 1px solid #ccc;
          height: calc(1.5em + 0.75rem + 2px);
          padding: 0.375rem 0.75rem;
          font-family: 'Pretendard';
          font-style: normal;
          font-weight: 400;
          font-size: 14px;
          margin-bottom: 24px;
        }
        input:focus {
          outline: none;
        }
      }

      .modal-body {
        overflow-y: auto;
        max-height: 50vh;
        margin: 0px;
        .upload {
          img {
            width: 100%;
          }
        }
      }

      .modal-footer {
        .modal-default-button {
          float: right;
          width: 100px;
        }
      }
    }
  }
}

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
.search-bar {
  z-index: 100000;
  width: 480px;
  height: 40px;
  background: $artong-white;
  border: 1px solid #e5e5e5;
  border-radius: 999px;
  line-height: 30px;
  position: fixed;
  left: calc(50% - 480px / 2);
  top: 15px;
  display: flex;
  padding: 11px 13px;
  box-sizing: border-box;
  img {
    vertical-align: middle;
  }
  .search-input {
    margin-left: 10px;
    border: none;
    width: 408px;
    height: 17px;
    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    padding: 0px;
    border-radius: 0px;
  }
  input:focus {
    outline: none;
  }
}
.title {
  font-family: 'Pretendard';
  font-style: normal;
  font-weight: 600;
  font-size: 18px;
  color: $artong-black;
  display: flex;
}
.content,
.project,
.member {
  margin-top: 8px;
  cursor: pointer;
}
.projects {
  margin-top: 24px;
}
.members {
  margin-top: 24px;
}
.nullSearch {
  font-size: 18px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  word-break: keep-all;
}

@media (max-width: 500px) {
  .modal-mask {
    .modal-wrapper {
      padding: auto 10px;
      .modal-container {
        width: 90%;
        left: auto;
        margin-left: 5%;
      }
    }
  }
}
@media (max-width: 1080px) {
  .nullSearch {
    top: 65%;
  }
}
</style>
