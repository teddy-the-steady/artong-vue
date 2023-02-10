<template>
  <div class="info">
    <div class="lang">
      <LangDropdown class="lang-option" :langOptions="langOptions" />
    </div>
    <div class="container0">
      <div class="container0-box">
        <div class="intro">
          <div class="intro-title">
            {{ $t('main.title.first') }}<br />{{ $t('main.title.second') }}
          </div>
          <div class="intro-content">
            {{ $t('main.intro-content.first') }}<br />{{
              $t('main.intro-content.second')
            }}<br />{{ $t('main.intro-content.third') }}
          </div>
          <button class="start-btn" v-ripple @click="contribute">
            {{ $t('main.start-btn') }}
          </button>
        </div>
        <div class="main-token">
          <div class="main-token-top">
            <div class="category">
              {{ mainToken.project ? mainToken.project.symbol : '' }}
            </div>
            <div class="main-token-name">{{ mainToken.name }}</div>
          </div>
          <div
            class="main-token-img"
            @click="onContentClick($event, mainToken)"
          >
            <img :src="contentImagePath(mainToken)" />
          </div>
          <div class="main-token-bottom">
            <div class="main-token-bottom-child">
              <div class="main-token-bottom-title">
                {{ $t('main.main-token-bottom-title.project') }}
              </div>
              <div class="main-token-bottom-content">
                <router-link
                  :to="{
                    name: 'Project',
                    params: {
                      id: this.mainToken.project
                        ? this.mainToken.project.id
                        : '',
                    },
                  }"
                >
                  <ProjectPageProfile_small
                    :project="this.mainToken.project"
                    :isFirstLoading="isFirstLoading"
                  ></ProjectPageProfile_small>
                </router-link>
              </div>
            </div>
            <div class="main-token-bottom-child">
              <div class="main-token-bottom-title">
                {{ $t('main.main-token-bottom-title.created-by') }}
              </div>
              <div class="main-token-bottom-content">
                <router-link
                  :to="{
                    name: 'UserOrArtist',
                    params: {
                      id: this.mainToken.owner
                        ? this.mainToken.owner.username
                        : '',
                    },
                  }"
                >
                  <ContentsProfile
                    :member="this.mainToken ? this.mainToken.owner : null"
                    :needUserName="true"
                    :isFirstLoading="isFirstLoading"
                  ></ContentsProfile>
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="container1">
      <div class="title">{{ $t('main.container1.title') }}</div>
      <div class="row">
        <div class="activity">
          <img
            class="intro-img"
            src="../../assets/icons/wallet-passes-app.svg"
          />
          <div class="subtitle">Wallet connection</div>
          <div class="content">
            Connect your wallet and start your journey in ARTONG
          </div>
        </div>
        <div class="activity">
          <img class="intro-img" src="../../assets/icons/100-add-folder.svg" />
          <div class="subtitle">Create your project</div>
          <div class="content">
            Create an open art project and build a vessel for your creativity
          </div>
        </div>
        <div class="activity">
          <img class="intro-img" src="../../assets/icons/fine-arts1.svg" />
          <div class="subtitle">Add your NFTs</div>
          <div class="content">Add your creation to any project you want</div>
        </div>
        <div class="activity">
          <img class="intro-img" src="../../assets/icons/102-blockchain.svg" />
          <div class="subtitle">Share the collection</div>
          <div class="content">
            Share your collection and invite the talents to your community
          </div>
        </div>
      </div>
    </div>
    <div class="container2">
      <div class="button-block" @click="createProject">
        <img
          class="button-block-img"
          src="../../assets/icons/plus-circle.svg"
        />
        <div class="button-block-title">Create new project</div>
        <div class="button-block-description">Create Your Own NFT Project</div>
      </div>
    </div>
    <div class="container3">
      <div
        class="container3-box"
        :class="{ 'width-auto': innerWidth > 1080 && innerWidth < 1440 }"
      >
        <div class="top-container">
          <div class="title">Highlighted Projects</div>
        </div>
        <CuratedCollection
          v-if="innerWidth < 1080"
          :projects="highlightedProjects"
        ></CuratedCollection>
        <div v-else-if="innerWidth < 1440">
          <CuratedCollectionWide
            v-for="(project, i) in highlightedProjects"
            :key="i"
            class="curated-collection-wide1"
            :project="project"
          ></CuratedCollectionWide>
        </div>
        <div v-else class="curated-collection-wide-box">
          <CuratedCollectionWide
            v-for="(project, i) in highlightedProjects"
            :key="i"
            class="curated-collection-wide2"
            :project="project"
          ></CuratedCollectionWide>
        </div>
        <div class="top-container margin-top">
          <div class="title">Featured Contributors</div>
        </div>
        <FeaturedCreator
          :profiles="mainContributors"
          class="featured-creator"
        ></FeaturedCreator>
      </div>
    </div>
    <div class="container4">
      <div class="top-container margin-top">
        <div class="title">Artong's Pick</div>
      </div>
      <TokensByCollection
        class="margin-bottom"
        :tokens="artongsPickTokens"
        :needContentName="true"
      ></TokensByCollection>
      <div class="top-container margin-top">
        <div class="title">Recent Contribution</div>
      </div>
      <TokensByCollection
        class="margin-bottom"
        :tokens="recentTokens"
        :needContentName="true"
      ></TokensByCollection>
    </div>
    <div class="container5">
      <div class="img">
        <svg
          class="logo"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1690 300"
        >
          <g>
            <path
              d="M1614.9,90c41.48,0,75.1,33.62,75.1,75.1v-35.11c0-71.79-58.2-129.99-129.99-129.99h0c-6.8,0-13.49,.52-20.01,1.53-62.3,9.62-110,63.48-110,128.48v40c0,16.18,2.96,31.67,8.37,45.95,13.18,34.87,40.92,62.58,75.81,75.72,8.24,3.1,16.88,5.4,25.82,6.78,6.52,1.01,13.19,1.53,19.99,1.53h0c16.18,0,31.67-2.97,45.97-8.37,34.85-13.17,62.54-40.89,75.7-75.74,5.01-13.29,7.92-27.61,8.3-42.56-.89-29.6-25.14-53.33-54.96-53.33s-55,24.62-55,55v15c0,11.05-8.95,20-20,20s-20-8.95-20-20v-25.1c0-41.37,33.53-74.9,74.9-74.9Z"
            />
            <path
              d="M805,0h-189.84c-30.46,0-55.16,24.69-55.16,55.16h0c0,30.29,24.55,54.84,54.84,54.84h.34c1.77-26.64,17.43-49.47,39.81-61.32,10.46-5.54,22.38-8.68,35.04-8.68h0c39.73,0,72.22,30.92,74.78,70h-.06c-2.53-28.03-26.07-50-54.76-50h0c-28.69,0-52.24,21.97-54.76,50h-.24V244.84c0,30.46,24.69,55.16,55.16,55.16h0c30.29,0,54.84-24.55,54.84-54.84V110h40c30.38,0,55-24.62,55-55h0c0-30.38-24.62-55-55-55Z"
            />
            <path
              d="M130.01,0h0c-6.8,0-13.49,.52-20.01,1.53C47.7,11.16,0,65.01,0,130.01v114.83c0,30.46,24.69,55.16,55.16,55.16h0c30.29,0,54.84-24.55,54.84-54.84v-80.26c0-41.37,33.53-74.9,74.9-74.9h0c41.48,0,75.1,33.62,75.1,75.1v-35.11C260,58.2,201.8,0,130.01,0Z"
            />
            <path
              d="M205,120h0c-30.38,0-55,24.62-55,55v69.84c0,30.46,24.69,55.16,55.16,55.16h0c30.29,0,54.84-24.55,54.84-54.84v-70.16c0-30.38-24.62-55-55-55Z"
            />
            <path
              d="M1355,0h-75c-6.8,0-13.48,.53-20,1.53-62.3,9.62-110,63.48-110,128.48v114.83c0,30.46,24.69,55.16,55.16,55.16h0c30.29,0,54.84-24.55,54.84-54.84v-100.26c0-19.67,7.6-37.56,20-50.93,5.73-6.17,12.49-11.38,20-15.34,.13-.07,.26-.13,.4-.2,10.33-5.37,22.06-8.43,34.5-8.43h0c1.72,0,3.41,.08,5.1,.19,1.92,.13,3.82,.32,5.7,.59-25.93,4.38-45.68,26.92-45.7,54.1v.04h0v120c0,13.33,4.74,25.55,12.61,35.08,10.1,12.22,25.37,20,42.46,20h.16c17.05,0,32.27-7.79,42.31-20,7.78-9.46,12.45-21.56,12.45-34.76V55c0-30.38-24.62-55-55-55Z"
            />
            <path
              d="M1000,0h0c-71.8,0-130,58.2-130,130v40c0,71.8,58.2,130,130,130h0c71.8,0,130-58.2,130-130v-40c0-71.8-58.2-130-130-130Zm55,158.46c0,30.38-24.62,55-55,55h0c-30.38,0-55-24.62-55-55v-16.92c0-30.38,24.62-55,55-55h0c30.38,0,55,24.62,55,55v16.92Z"
            />
            <path
              d="M485,0h-150c-30.38,0-55,24.62-55,55V244.84c0,30.46,24.69,55.16,55.16,55.16h0c30.29,0,54.84-24.55,54.84-54.84v-100.26c0-19.67,7.6-37.56,20-50.93,5.73-6.17,12.49-11.38,20-15.34,10.42-5.5,22.29-8.63,34.9-8.63h0c1.72,0,3.41,.08,5.1,.19,1.92,.13,3.82,.32,5.7,.59-25.93,4.38-45.68,26.92-45.7,54.1v.04c0,30.42,24.66,55.08,55.08,55.08h.16c27.13,0,49.64-19.73,53.99-45.62,.41-2.47,.66-4.99,.73-7.56,.03,1.05,.04,2.11,.04,3.17V55c0-30.38-24.62-55-55-55Z"
            />
            <path
              d="M485.08,190h-.16c-17.94,0-33.86,8.6-43.89,21.9-6.93,9.19-11.04,20.62-11.04,33.02,0,13.33,4.74,25.55,12.61,35.08,10.1,12.22,25.37,20,42.46,20h.16c17.05,0,32.27-7.79,42.31-20,7.78-9.46,12.45-21.56,12.45-34.76v-.31c0-8.98-2.17-17.44-5.98-24.92-9.08-17.8-27.58-30-48.94-30Z"
            />
          </g>
        </svg>
      </div>
      <div class="bottom-link">
        <div class="bottom-table">
          <ul class="column second-column">
            <li>Company</li>
            <li class="clickable" @click="redirectTo('https://www.4rtong.com')">
              About
            </li>
            <li class="clickable">Careers</li>
          </ul>
          <ul class="column third-column">
            <li>Connect</li>
            <li
              class="clickable"
              @click="redirectTo('https://twitter.com/4rtong')"
            >
              Twitter
            </li>
            <li
              class="clickable"
              @click="redirectTo('https://www.instagram.com/artong.io/')"
            >
              Instagram
            </li>
          </ul>
        </div>
        <div class="bottom-left">
          <div class="bottom-word clickable">Privacy Info</div>
          <div class="bottom-word clickable">Terms of Service</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { headerActivate } from '../../mixin'
import Ripple from '../../directives/ripple/Ripple'
import { makeS3Path } from '../../util/commonFunc'
import {
  graphql,
  queryToken,
  queryTokensInIdArray,
  queryHighlightedProjects,
  queryTokens,
} from '../../api/graphql'
import { getMainContents } from '../../api/contents'
import { getMainContributors } from '../../api/member'
import { languages } from '../../locales/languages'
import ContentsProfile from '../profile/ContentsProfile.vue'
import ProjectPageProfile_small from '../profile/ProjectPageProfile_small.vue'
import TokensByCollection from '../collection_card/TokensByCollection.vue'
import CuratedCollection from '../collection_card/CuratedCollection.vue'
import FeaturedCreator from '../collection_card/FeaturedCreator.vue'
import CuratedCollectionWide from '../collection_card/CuratedCollection_wide.vue'
import LangDropdown from '../dropdown/LangDropdown.vue'

export default {
  name: 'Main',
  mixins: [headerActivate],
  components: {
    CuratedCollection,
    TokensByCollection,
    FeaturedCreator,
    CuratedCollectionWide,
    ContentsProfile,
    ProjectPageProfile_small,
    LangDropdown,
  },
  computed: {
    ...mapState({
      innerWidth: state => state.menu.innerWidth,
      currentUser: state => state.user.currentUser,
    }),
  },
  data() {
    return {
      mainContents: {},
      mainToken: {},
      highlightedProjects: {},
      artongsPickTokens: {},
      isFirstLoading: true,
      mainContributors: {},
      recentTokens: {},
      langOptions: languages,
    }
  },
  directives: {
    ripple: Ripple,
  },
  methods: {
    async contribute() {
      this.$router.push({ name: 'Projects' })
    },
    createProject() {
      if (!this.currentUser.id) {
        this.$router.push({
          name: 'Login',
        })
      } else {
        this.$router.push({
          name: 'CreateProject',
        })
      }
    },
    makeS3Path(path) {
      return makeS3Path(path)
    },
    contentImagePath(content) {
      return (
        this.makeS3Path(content?.content_thumnail_s3key) ||
        this.makeS3Path(content?.content_s3key)
      )
    },
    projectImagePath(project) {
      return (
        this.makeS3Path(project?.project_thumnail_s3key) ||
        this.makeS3Path(project?.project_s3key)
      )
    },
    memberImagePath(member) {
      return (
        this.makeS3Path(member?.profile_thumnail_s3key) ||
        this.makeS3Path(member?.profile_s3key)
      )
    },
    onContentClick(event, val) {
      if (val.token_id || val.tokenId) {
        this.$router.push({
          name: 'ContentDetail',
          params: {
            project_address: val.project.id,
            token_id: val.token_id || val.tokenId,
            image_width: event.target.imageWidth,
            image_height: event.target.imageHeight,
          },
        })
      } else if (val.id) {
        this.$router.push({
          name: 'ContentCandidateDetail',
          params: {
            project_address: val.project.id,
            contents_id: val.id,
            image_width: event.target.imageWidth,
            image_height: event.target.imageHeight,
          },
        })
      }
    },
    redirectTo(url) {
      window.open(url)
    },
  },
  async created() {
    this.mainContents = await getMainContents()
    try {
      this.mainToken = await graphql(
        queryToken({
          variables: {
            id:
              this.mainContents.mainToken.project_address +
              this.mainContents.mainToken.token_id,
          },
          db: {
            project_address: this.mainContents.mainToken.project_address,
            token_id: this.mainContents.mainToken.token_id,
          },
        }),
      )
      this.mainToken = this.mainToken.token
      this.isFirstLoading = false
    } catch (error) {
      this.isFirstLoading = true
    }
    try {
      this.highlightedProjects = await graphql(
        queryHighlightedProjects({
          variables: {
            idArray: this.mainContents.highlightedProjects,
          },
        }),
      )
      this.highlightedProjects = this.highlightedProjects.projects
      this.isFirstLoading = false
    } catch (error) {
      this.isFirstLoading = true
    }
    try {
      this.artongsPickTokens = await graphql(
        queryTokensInIdArray({
          variables: {
            idArray: this.mainContents.artongsPick,
          },
        }),
      )
      this.artongsPickTokens = this.artongsPickTokens.tokens
      this.isFirstLoading = false
    } catch (error) {
      this.isFirstLoading = true
    }
    try {
      this.mainContributors = await getMainContributors()
      this.recentTokens = await graphql(
        queryTokens({
          variables: {
            first: 10,
            skip: 0,
            orderBy: 'createdAt',
            orderDirection: 'desc',
          },
        }),
      )
      this.recentTokens = this.recentTokens.tokens
      this.isFirstLoading = false
    } catch (error) {
      this.isFirstLoading = true
    }
  },
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/variables';

.lang {
  position: absolute;
  top: 90px;
  right: 10%;

  .lang-option {
    position: relative;
  }
}

.intro {
  display: flex;
  flex-direction: column;
  margin-left: 16px;
  margin-right: 16px;
  margin-top: 48px;
  row-gap: 48px;

  .intro-title {
    width: 295px;
    font-family: 'Mustica Pro';
    font-style: $item-font-style;
    font-weight: 600;
    font-size: 52px;
    line-height: 72px;
    text-transform: capitalize;
    color: $artong-black;
    text-align: left;
  }

  .intro-content {
    width: 95%;
    font-family: $item-font;
    font-style: $item-font-style;
    font-weight: 400;
    font-size: 20px;
    line-height: 25px;
    color: #4d4d4d;
    align-self: stretch;
    text-align: left;
  }

  .start-btn {
    width: 161px;
  }
}

.main-token {
  display: none;
}

.container1 {
  display: flex;
  flex-direction: column;
  margin-top: 48px;

  .title {
    width: 308px;
    height: 44px;
    font-family: 'Mustica Pro';
    font-style: $item-font-style;
    font-weight: 600;
    font-size: 32px;
    line-height: 44px;
    margin: auto;
    margin-bottom: 48px;
    color: $artong-black;
  }

  .activity {
    .intro-img {
      width: 32px;
      height: 32px;
      margin: auto;
      margin-bottom: 16px;
    }

    .subtitle {
      width: 195px;
      height: 24px;
      font-family: 'Pretendard';
      font-style: normal;
      font-weight: 600;
      font-size: 20px;
      line-height: 24px;
      color: $artong-black;
      margin: auto;
      margin-bottom: 16px;
    }

    .content {
      width: 91.1%;
      max-width: 432px;
      font-family: 'Pretendard';
      font-style: normal;
      font-weight: 400;
      font-size: 16px;
      line-height: 150%;
      text-align: center;
      color: #4d4d4d;
      margin: auto;
      margin-bottom: 40px;
    }
  }
}

.container2 {
  display: flex;
  flex-direction: column;
  row-gap: 40px;
  margin-top: 48px;
  margin-bottom: 48px;
  cursor: pointer;

  .button-block {
    width: 91.1%;
    height: 160px;
    background: $artong-white;
    border: 1px solid $profile-border-gray;
    box-shadow: 2px 2px 12px rgba(0, 0, 0, 0.14);
    border-radius: 14px;
    margin: auto;
    background-image: linear-gradient(
        90deg,
        rgba(242, 46, 62, 0.1) 1px,
        transparent 1px
      ),
      linear-gradient(0deg, rgba(242, 46, 62, 0.1) 1px, transparent 1px);
    background-size: 32px 32px;

    .button-block-img {
      width: 24px;
      height: 24px;
      margin: auto;
      margin-top: 25px;
    }

    .button-block-title {
      width: 181px;
      height: 22px;
      font-family: $item-font;
      font-style: $item-font-style;
      font-weight: 600;
      font-size: 18px;
      line-height: 22px;
      color: $artong-black;
      margin: auto;
      margin-top: 10.4px;
      margin-bottom: 8px;
    }

    .button-block-description {
      width: 248px;
      height: 48px;
      font-family: $item-font;
      font-style: $item-font-style;
      font-weight: 400;
      font-size: 16px;
      line-height: 150%;
      color: #4d4d4d;
      margin: auto;
      margin-bottom: 25px;
    }
  }
}

.container3 {
  height: auto;
  background: $artong-black;
  padding-top: 48px;
  padding-bottom: 48px;

  .top-container {
    display: flex;
    flex-direction: row;
    margin-bottom: 24px;

    .title {
      margin-left: 16px;
      font-family: 'Mustica Pro';
      font-style: normal;
      font-weight: 600;
      font-size: 22px;
      color: #b3b3b3;
      text-align: left;
    }
  }

  .curated-collection-wide1 {
    margin-bottom: 24px;
    margin-left: auto;
    margin-right: auto;
  }

  .curated-collection-wide-box {
    margin: 0 auto;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    flex-wrap: wrap;
    transform: translate(12px, 0px);

    .curated-collection-wide2 {
      margin-right: 24px;
      margin-bottom: 24px;
    }
  }
}

.margin-top {
  margin-top: 48px;
}

.margin-bottom {
  margin-bottom: 48px;
}
.container4 {
  margin-top: 48px;

  .top-container {
    .title {
      height: 30px;
      font-family: 'Mustica Pro';
      font-style: $item-font-style;
      font-weight: 600;
      font-size: 22px;
      line-height: 30px;
      color: $artong-black;
      margin-left: 16px;
      text-align: left;
    }
  }
}

.container5 {
  margin-top: 48px;
  background-color: $artong-black;
  height: 282px;

  .img {
    text-align: left;

    svg {
      height: 24px;
      width: 133.59px;
      margin-top: 24px;
      margin-left: 24px;
      fill: $artong-white;
    }
  }
  .bottom-table {
    display: flex;
    flex-direction: row;
    margin-left: 24px;
    margin-top: 24px;
    .column {
      display: flex;
      flex-direction: column;
      margin-bottom: 0px;
      li {
        font-family: $item-font;
        font-style: $item-font-style;
        font-weight: 400;
        font-size: 14px;
        color: #cccccc;
        margin-bottom: 14px;
        position: static;
        text-align: left;
      }
    }
    .first-column {
      margin-right: 56px;
      margin-bottom: 10px;
    }
    .second-column {
      margin-right: 25px;
      list-style: none;
    }
  }
  .bottom-word {
    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    color: #b3b3b3;
    text-align: left;
    margin-left: 24px;
    margin-bottom: 16px;
  }
}
.bottom-table > .column > li:nth-child(1) {
  font-family: 'Mustica Pro';
  font-style: $item-font-style;
  font-weight: 600;
  font-size: 12px;
  color: #808080;
  margin-bottom: 16px;
}

@media (min-width: 1080px) and(max-width:1920px) {
  .container0 {
    text-align: center;
    .container0-box {
      flex-direction: row;
      margin-top: 96px;
      display: inline-flex;

      .intro {
        width: 420px;
      }

      .main-token {
        display: flex;
        flex-direction: column;
        flex-basis: 420px;
        gap: 10px;
        height: 553px;

        .category {
          width: 67px;
          height: 22px;
          border: 1px solid #f22e3e;
          border-radius: 999px;
          font-family: 'Pretendard';
          font-style: normal;
          font-weight: 500;
          font-size: 14px;
          line-height: 25px;
          color: #f22e3e;
          margin-bottom: 8px;
        }

        .main-token-name {
          font-family: $item-font;
          font-style: $item-font-style;
          font-weight: 700;
          font-size: 24px;
          text-align: left;

          color: $artong-black;

          margin-bottom: 6px;
        }

        .main-token-img {
          width: 400px;
          height: 400px;
          background-color: $artong-black;
          border-radius: 14px;
          margin-bottom: 6px;
          overflow: hidden;
          cursor: pointer;
          display: grid;
          align-items: center;

          img {
            object-fit: cover;
            max-width: 100%;
          }
        }

        .main-token-bottom {
          display: flex;
          flex-direction: row;

          .main-token-bottom-child {
            display: flex;
            flex-direction: column;
            flex-basis: 200px;

            .main-token-bottom-title {
              font-family: $item-font;
              font-style: $item-font-style;
              font-weight: 600;
              font-size: 18px;
              margin-bottom: 8px;
              text-align: left;
              color: $artong-black;
            }

            .main-token-bottom-content {
              display: flex;
              flex-direction: row;
              gap: 8px;
            }
          }
        }
      }
    }
  }

  .container1 {
    margin-top: 192px;

    .title {
      margin-bottom: 96px;
    }

    .row {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      gap: 80px;
      width: 560px;
      margin-left: auto;
      margin-right: auto;

      .activity {
        display: flex;
        flex-direction: column;
        gap: 16px;
        width: 240px;

        .intro-img {
          margin-bottom: 0px;
        }

        .subtitle {
          margin-bottom: 0px;
        }

        .content {
          margin-bottom: 0px;
        }
      }
    }
  }

  .container2 {
    display: flex;
    flex-direction: row;
    column-gap: 40px;
    margin-top: 96px;
    margin-bottom: 96px;
    width: 696px;
    margin-left: auto;
    margin-right: auto;
  }

  .container3 {
    padding-top: 96px;
    padding-bottom: 96px;

    .container3-box {
      width: 1440px;
      margin: 0 auto;

      &.width-auto {
        width: auto;
        margin: 0 auto;
      }
    }
  }

  .margin-top {
    margin-top: 96px;
  }

  .margin-bottom {
    margin-bottom: 96px;
  }
  .button-block {
    width: 560px;
  }
  .container5 {
    padding-top: 72px;
    padding-bottom: 72px;
    .bottom-link {
      display: flex;
      flex-direction: row-reverse;

      .bottom-table {
        margin-top: 57px;
        .third-column {
          margin-right: 61px;
          list-style: none;
        }
      }
      .bottom-left {
        margin-right: auto;
        margin-top: 124px;
      }

      .clickable {
        cursor: pointer;
      }
    }
  }
}

@media (min-width: 1920px) {
  .container0 {
    text-align: center;
    .container0-box {
      display: inline-flex;
      flex-direction: row;
      margin-top: 96px;

      .main-token {
        display: flex;
        flex-direction: column;
        flex-basis: 420px;
        gap: 10px;
        height: 553px;

        .category {
          width: 67px;
          height: 22px;
          border: 1px solid #f22e3e;
          border-radius: 999px;
          font-family: 'Pretendard';
          font-style: normal;
          font-weight: 500;
          font-size: 14px;
          line-height: 25px;
          color: #f22e3e;
          margin-bottom: 8px;
        }

        .main-token-name {
          font-family: $item-font;
          font-style: $item-font-style;
          font-weight: 700;
          font-size: 24px;
          text-align: left;
          color: $artong-black;
          margin-bottom: 6px;
        }

        .main-token-img {
          width: 400px;
          height: 400px;
          background-color: $artong-black;
          border-radius: 14px;
          margin-bottom: 6px;
          overflow: hidden;
          display: grid;
          align-items: center;

          img {
            object-fit: cover;
            max-width: 100%;
          }
        }

        .main-token-bottom {
          display: flex;
          flex-direction: row;

          .main-token-bottom-child {
            display: flex;
            flex-direction: column;
            flex-basis: 200px;

            .main-token-bottom-title {
              font-family: $item-font;
              font-style: $item-font-style;
              font-weight: 600;
              font-size: 18px;
              margin-bottom: 8px;
              text-align: left;
              color: $artong-black;
            }

            .main-token-bottom-content {
              display: flex;
              flex-direction: row;
              gap: 8px;
            }
          }
        }
      }
    }
  }

  .container1 {
    margin-top: 192px;

    .row {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      gap: 80px;
      width: 1200px;
      height: 304px;
      margin-left: auto;
      margin-right: auto;

      .activity {
        display: flex;
        flex-direction: column;
        gap: 16px;
        width: 240px;

        .intro-img {
          margin-bottom: 0px;
        }

        .subtitle {
          margin-bottom: 0px;
        }

        .content {
          margin-bottom: 0px;
        }
      }
    }
  }

  .container2 {
    display: flex;
    flex-direction: row;
    column-gap: 40px;
    margin-top: 96px;
    margin-bottom: 96px;
    width: 696px;
    margin-left: auto;
    margin-right: auto;

    .button-block {
      width: 328px;
    }
  }

  .container3 {
    padding-top: 96px;
    padding-bottom: 96px;

    .container3-box {
      width: 1440px;
      margin: 0 auto;
    }
  }

  .margin-top {
    margin-top: 96px;
  }

  .container4 {
    width: 1440px;
    margin-left: auto;
    margin-right: auto;
  }

  .margin-bottom {
    margin-bottom: 192px;
  }
  .container5 {
    padding-top: 72px;
    padding-bottom: 72px;
    .img {
      margin-left: 240px;
      margin-right: 240px;
    }
    .bottom-link {
      display: flex;
      flex-direction: row-reverse;
      margin-left: 240px;
      margin-right: 240px;

      .bottom-table {
        margin-top: 57px;
        .third-column {
          margin-right: 61px;
          list-style: none;
        }
      }
      .bottom-left {
        margin-right: auto;
        margin-top: 124px;
      }

      .clickable {
        cursor: pointer;
      }
    }
  }
}
</style>
