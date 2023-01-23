<template>
  <div>
    <div v-if="innerWidth >= 1080" class="search-bar" @click="openSearchModal">
      <img src="../../assets/icons/search-grey.svg" />
      <input
        id="search-input1"
        placeholder="Search"
        type="text"
        class="search-input"
        v-model="searchWord"
        @keyup="search"
      />
      <img
        src="../../assets/icons/clear.svg"
        class="clear-button"
        v-if="isSearchModalOpen && innerWidth >= 1080"
        @click.stop="closeSearchModal"
      />
    </div>
    <transition name="modal" v-if="isSearchModalOpen || openSearchModalSignal">
      <div class="modal-mask">
        <div class="modal-wrapper">
          <div class="modal-container">
            <div class="modal-header">
              <slot name="header">
                <input
                  id="search-input2"
                  placeholder="Search"
                  v-if="innerWidth < 1080"
                  v-model="searchWord"
                  @keyup="search"
                />
              </slot>
            </div>

            <div class="modal-body">
              <slot name="body">
                <div class="contents">
                  <div class="title">Tokens</div>
                  <div class="results">
                    <div
                      class="content"
                      v-for="(content, k) in contents"
                      :key="k"
                    >
                      {{ content.id }}
                    </div>
                  </div>
                </div>
                <div class="projects">
                  <div class="title">Projects</div>
                  <div class="results"></div>
                </div>
                <div class="members">
                  <div class="title">User</div>
                  <div class="results"></div>
                </div>
              </slot>
            </div>

            <div class="modal-footer">
              <slot name="footer">
                <button @click="closeSearchModal">close</button>
              </slot>
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

export default {
  name: 'BasicModal',
  props: {
    openSearchModalSignal: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isSearchModalOpen: false,
      searchWord: '',
      contents: [],
      projects: [],
      members: [],
    }
  },
  computed: {
    ...mapState({
      innerWidth: state => state.menu.innerWidth,
    }),
  },
  methods: {
    async search() {
      console.log('searchWord: ' + this.searchWord)
      const [result1, result2, result3] = await Promise.all([
        searchContents(this.searchWord),
        searchProjects(this.searchWord),
        searchMembers(this.searchWord),
      ])
      this.contents = result1
      this.projects = result2
      this.members = result3
      console.log(this.contents)
    },
    async searchContents(searchWord) {
      try {
        return await searchContents(searchWord)
      } catch {
        console.log('검색 결과 없음')
        return null
      }
    },
    async searchProjects(searchWord) {
      try {
        return await searchProjects(searchWord)
      } catch {
        console.log('검색 결과 없음')
        return null
      }
    },
    async searchMembers(searchWord) {
      try {
        return await searchMembers(searchWord)
      } catch {
        console.log('검색 결과 없음')
        return null
      }
    },
    openSearchModal() {
      this.isSearchModalOpen = true
    },
    closeSearchModal() {
      this.isSearchModalOpen = false
      this.searchWord = ''
      this.$emit('close-search-modal')
    },
  },
  watch: {},
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
  height: 100%;
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
        }
        input:focus {
          outline: none;
        }
      }

      .modal-body {
        margin: 20px 0;
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
.clear-button {
  // position: fixed;
  // border: none !important;
  // z-index: 100001;
  // top: 16px;
  // transform: translateX(190px);
  // width: 30px;
  // height: 30px;
}

@media (max-width: 500px) {
  .modal-mask {
    .modal-wrapper {
      padding: auto 10px;
      .modal-container {
        width: 100%;
        left: auto;
      }
    }
  }
}
</style>
