<template>
  <div>
    <div class="content-image">
      <a
        :href="content ? makeS3Path(content.content_s3key) : ''"
        target="_blank"
      >
        <img :src="imagePath" />
      </a>
    </div>
    <div class="content-wrap">
      <div class="content-info">
        <div class="left-container">
          <div class="round-box">
            <TableDiv
              :tableName="'Offers'"
              :iconSrc="require('@/assets/icons/100-add-folder.svg')"
              :showHeader="true"
              :fields="[
                {
                  name: 'EVENT',
                  type: 'event',
                  key: 'history_type',
                },
                {
                  name: 'PRICE',
                  type: 'price',
                  key: 'price',
                },
                {
                  name: 'DATE',
                  type: 'date',
                  key: 'createdAt',
                },
                {
                  name: 'FROM',
                  type: 'member',
                  key: 'from',
                },
              ]"
            ></TableDiv>
          </div>
          <div class="round-box">
            <TableDiv
              :tableName="'History'"
              :iconSrc="require('@/assets/icons/history.svg')"
              :showHeader="true"
              :fields="[
                {
                  name: 'PRICE',
                  type: 'price',
                  key: 'price',
                },
                {
                  name: 'From',
                  type: 'member',
                  key: 'from_member',
                },
                {
                  name: 'DATE',
                  type: 'date',
                  key: 'block_timestamp',
                },
                {
                  name: 'TO',
                  type: 'member',
                  key: 'to_member',
                },
              ]"
            ></TableDiv>
          </div>
        </div>
        <div class="right-container">
          <div class="add-info">
            <div class="like-view">
              <div>
                <img src="@/assets/icons/like.svg" />
                <span>{{ content ? content.total_likes : '' }}</span>
              </div>
            </div>
            <div class="buttons">
              <button
                class="white-button round-button ripple"
                @click="likeToggle"
              >
                <svg
                  width="20"
                  height="18"
                  viewBox="0 0 20 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2.42602 9.31146L10 16.8854L17.574 9.31146C19.4753 7.4101 19.4753 4.32738 17.574 2.42602C15.6726 0.52466 12.5899 0.52466 10.6885 2.42602L10 3.11456L9.31146 2.42602C7.4101 0.52466 4.32738 0.52466 2.42602 2.42602C0.52466 4.32738 0.52466 7.4101 2.42602 9.31146Z"
                    stroke="black"
                    stroke-width="2"
                    stroke-linejoin="round"
                    :class="{
                      like: content ? (content.like ? likeStyle : '') : '',
                    }"
                  />
                </svg>
              </button>
              <button class="white-button round-button ripple" @click="share">
                <img src="@/assets/icons/share.svg" />
              </button>
              <button
                class="white-button round-button ripple"
                @mousedown="moreMouseDown"
                @mouseup="moreMouseUp"
                @touchstart="moreTouchStart"
                @touchend="moreTouchEnd"
              >
                <img src="@/assets/icons/more.svg" />
              </button>
              <BasicDialog
                class="dialog"
                :class="{ active: isDialogActive }"
                @dialog-focus-out="closeDialog"
                ref="dialog"
              >
                <div slot="body">Report</div>
              </BasicDialog>
            </div>
          </div>
          <div class="name">
            {{ content ? content.name : '' }}
          </div>
          <div class="owner">
            <div class="label">Owned by</div>
            <router-link
              :to="{
                name: 'UserOrArtist',
                params: { id: content ? content.owner.username : '' },
              }"
            >
              <ContentsProfile
                :member="content ? content.owner : null"
                :needUserName="true"
                :isFirstLoading="isFirstLoading"
              ></ContentsProfile>
            </router-link>
          </div>
          <div class="collection">
            <div class="info">
              <div class="label">Project</div>
              <router-link
                :to="{
                  name: 'Project',
                  params: { id: content ? content.project_address : null },
                }"
              >
                <ProjectPageProfile_small
                  :project="project"
                  :isFirstLoading="isFirstLoading"
                ></ProjectPageProfile_small>
              </router-link>
            </div>
            <div class="info">
              <div class="label">Created By</div>
              <router-link
                :to="{
                  name: 'UserOrArtist',
                  params: { id: content ? content.owner.username : '' },
                }"
              >
                <ContentsProfile
                  :member="content ? content.owner : null"
                  :needUserName="true"
                  :isFirstLoading="isFirstLoading"
                ></ContentsProfile>
              </router-link>
            </div>
          </div>
          <div class="information">
            <div class="label">Information</div>
            <div>
              {{ content ? content.description : '' }}
            </div>
          </div>
          <div class="price-box">
            <div class="label">Price</div>
            <div>
              {{ content ? weiToEther(price) : '' }}
              ETH
            </div>
          </div>
          <div class="trade-buttons">
            <div v-if="checkPolicyAndStatus">
              <button @click="buy()">
                <div class="spinner" :class="{ active: buying }"></div>
                <span v-show="!buying">Buy</span>
              </button>
            </div>
            <div v-else-if="isCurrentUserProjectOwner">
              <button @click="approve()" class="white-button">Approve</button>
            </div>
          </div>
        </div>
      </div>
      <div class="collection-container">
        <div class="header">
          <div class="title">More from this project</div>
          <div class="url">
            <router-link
              :to="{
                name: 'Project',
                params: { id: content ? content.project_address : null },
              }"
              >View more</router-link
            >
          </div>
        </div>
        <div class="token-list">
          <TokensByCollection
            :tokens="tokens"
            class="container5-component-margin"
          ></TokensByCollection>
        </div>
      </div>
    </div>
    <PromptModal
      v-if="isModalOpen"
      @close-modal="toggleModal"
      :confirmOnProcess="confirmOnProcess"
      :cancelDisabled="cancelDisabled"
      ref="promptModal"
    ></PromptModal>
    <textarea v-model="url" ref="url"></textarea>
  </div>
</template>

<script>
import { ethers } from 'ethers'
import { mapState } from 'vuex'
import { headerActivate } from '../../mixin'
import { graphql, queryTokensByProject, queryProject } from '../../api/graphql'
import {
  getContent,
  patchContent,
  patchContentStatus,
  getContentVoucher,
} from '../../api/contents'
import { postContentReactions } from '../../api/contents'
import {
  makeS3Path,
  weiToEther,
  isSessionValid,
  checkMobileWalletStatusAndGetSigner,
} from '../../util/commonFunc'
import { ERC721_ABI } from '../../contracts'
import Provider from '../../util/walletConnectProvider'
import ContentsProfile from '../profile/ContentsProfile.vue'
import TokensByCollection from '../collection_card/TokensByCollection.vue'
import PromptModal from '../modal/PromptModal.vue'
import TableDiv from '../table/TableDiv.vue'
import ProjectPageProfile_small from '../profile/ProjectPageProfile_small.vue'
import BasicDialog from '../dialog/BasicDialog.vue'

export default {
  name: 'CandidateDetail',
  mixins: [headerActivate],
  components: {
    ContentsProfile,
    TokensByCollection,
    PromptModal,
    TableDiv,
    ProjectPageProfile_small,
    BasicDialog,
  },
  data() {
    return {
      content: null,
      tokens: [],
      project: null,
      signer: null,
      confirmOnProcess: false,
      cancelDisabled: false,
      buying: false,
      isFirstLoading: true,
      isDialogActive: false,
      isMouseDownOnMore: false,
      isMouseUpOnMore: false,
      url: '',
    }
  },
  computed: {
    ...mapState({
      currentUser: state => state.user.currentUser,
      isModalOpen: state => state.menu.isModalOpen,
    }),
    isMobile() {
      return this.$isMobile()
    },
    isCurrentUserProjectOwner() {
      return (
        this.currentUser.wallet_address === this.project?.owner.wallet_address
      )
    },
    price() {
      return parseInt(this.content.price).toString()
    },
    checkPolicyAndStatus() {
      if (this.project?.policy === 1) {
        if (this.content.status === 'APPROVED') {
          return true
        } else {
          return false
        }
      } else {
        return true
      }
    },
    imagePath() {
      return (
        this.makeS3Path(this.content?.content_thumbnail_s3key) ||
        this.makeS3Path(this.content?.content_s3key)
      )
    },
    likeStyle() {
      return 'filter: invert(22%) sepia(38%) saturate(5871%) hue-rotate(342deg) brightness(106%) contrast(90%); fill: $profile-border-red;'
    },
  },
  methods: {
    async getContents(project_address) {
      const [project, tokensByProject] = await Promise.all([
        graphql(
          queryProject({
            variables: {
              id: project_address,
            },
          }),
        ),
        graphql(
          queryTokensByProject({
            variables: {
              first: 20,
              skip: 0,
              start_num: 0,
              project: project_address,
              orderBy: 'createdAt',
              orderDirection: 'desc',
            },
          }),
        ),
      ])

      this.project = project.project
      this.tokens = tokensByProject.tokens
    },
    toggleModal() {
      this.$store.commit('TOGGLE_MODAL')
    },
    async approve() {
      await patchContentStatus(this.project.id, this.content.id, {
        status: 'APPROVED',
      })
    },
    async buy() {
      if (!(await isSessionValid(this.$router.currentRoute.fullPath))) {
        return
      }

      this.signer = await checkMobileWalletStatusAndGetSigner(
        this.$router.currentRoute.fullPath,
      )
      if (!this.signer) {
        return
      }

      const contract = new ethers.Contract(
        this.$router.currentRoute.params.project_address,
        ERC721_ABI,
        this.signer,
      )

      try {
        this.buying = true
        await this.redeem(contract)
      } finally {
        this.buying = false
      }
    },
    async redeem(contract) {
      const contentResult = await getContentVoucher(this.content.id)
      const voucher = contentResult.voucher

      const tx = await contract.populateTransaction.redeem(
        this.currentUser.wallet_address,
        voucher,
        { value: this.price },
      )
      const txHash = await this.signer.sendUncheckedTransaction(tx)
      const approveReceipt = await this.wait(txHash)
      const tokenId = parseInt(approveReceipt.logs[1].topics[3])

      await patchContent(this.content.id, {
        tokenId: tokenId,
        isRedeemed: true,
      })
    },
    makeS3Path(path) {
      return makeS3Path(path)
    },
    weiToEther(wei) {
      return weiToEther(wei)
    },
    convertDay(date) {
      const toDay = new Date()
      const now = toDay.getTime()
      const deadLine = date * 1000

      return Math.ceil((now - deadLine) / (1000 * 3600 * 24)) + 'Day'
    },
    async wait(txHash) {
      if (this.isMobile) {
        return await Provider.mobileProvider.waitForTransaction(txHash)
      } else {
        return await Provider.pcProvider.waitForTransaction(txHash)
      }
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
          alert('공유하기가 지원되지 않는 환경입니다.')
        }
      } else {
        this.setURL()
        const element = this.$refs.url
        element.select()
        document.execCommand('copy')
        alert('링크 복사 완료')
      }
    },
    async likeToggle() {
      if (!(await isSessionValid(this.$router.currentRoute.fullPath))) {
        return
      }

      let reactionCode = ''

      if (this.content.like) {
        reactionCode = 'UNLIKE'
      } else {
        reactionCode = 'LIKE'
      }

      const result = await postContentReactions(this.content.id, reactionCode)
      if (result) {
        this.content.like = reactionCode === 'LIKE' ? true : false
        this.content.total_likes = result.total_likes
      }
    },
  },
  async created() {
    this.isFirstLoading = true
    this.content = await getContent(
      this.$route.params.project_address,
      this.$route.params.contents_id,
    )
    await this.getContents(this.$route.params.project_address)
    this.isFirstLoading = false

    this.$watch(
      () => this.$route,
      async to => {
        if (to.name === 'ContentCandidateDetail') {
          this.isFirstLoading = true
          this.content = await getContent(
            this.$route.params.project_address,
            this.$route.params.contents_id,
          )
          await this.getContents(to.params.project_address)
          this.isFirstLoading = false
        }
      },
    )
  },
  watch: {
    isDialogActive() {
      if (!this.isMobile) {
        this.$nextTick(() => this.$refs.dialog.$el.focus())
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/variables';
.content-image {
  a {
    display: flex;
    justify-content: center;
    max-height: 60vh;
    padding: 4rem 0;
    background: #f2f2f2;
    img {
      object-fit: contain;
      max-width: 100%;
    }
  }
}
.content-wrap {
  width: 100%;
  max-width: 1440px;
  padding: 40px 64px 0 64px;
  margin: 0 auto;
  .content-info {
    display: flex;
    flex-direction: row;

    .left-container {
      flex: 1;
      margin-right: 40px;
      .round-box {
        margin-bottom: 48px;
      }
    }

    .right-container {
      flex: 1;
      text-align: initial;
      .add-info {
        display: flex;
        transform: translateY(-24px);
        .like-view {
          flex: 1;
          display: flex;
          align-items: center;

          div {
            display: flex;

            img {
              filter: invert(89%) sepia(0%) saturate(2053%) hue-rotate(317deg)
                brightness(82%) contrast(87%);
            }
            span {
              margin-left: 5px;
              font-size: 13px;
              color: $gray;
            }
          }
        }

        .buttons {
          display: flex;
          justify-content: flex-end;
          height: 100%;

          path {
            &.like {
              filter: invert(22%) sepia(38%) saturate(5871%) hue-rotate(342deg)
                brightness(106%) contrast(90%);
              fill: $profile-border-red;
            }
          }

          button {
            margin-left: 10px;
          }

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
      }

      .name {
        margin-bottom: 20px;
        font-size: 32px;
        font-weight: 600;
      }
      .collection {
        display: flex;
        margin-top: 30px;
        justify-content: space-between;
        .info {
          width: 50%;
        }
      }
      .information {
        margin-top: 30px;
      }
      .price-box {
        margin-top: 30px;
        padding: 24px;
        height: 50px;
        background: #f2f2f2;
        border: 1px solid #cccccc;
        border-radius: 24px;
        input {
          border: none;
          background: #f2f2f2;
        }
      }
      .trade-buttons {
        margin-top: 20px;
        div {
          display: flex;
          justify-content: space-between;
          width: 100%;
          button {
            width: 100%;
            .spinner {
              display: none;

              &.active {
                display: inline-block;
                position: relative;
                width: 2px;
                margin: 0px auto;
                animation: rotation 0.6s infinite linear;
                border-left: 6px solid rgba(0, 174, 239, 0.15);
                border-right: 6px solid rgba(0, 174, 239, 0.15);
                border-bottom: 6px solid rgba(0, 174, 239, 0.15);
                border-top: 6px solid $artong-white;
                border-radius: 100%;
              }
            }

            @keyframes rotation {
              from {
                transform: rotate(0deg);
              }
              to {
                transform: rotate(359deg);
              }
            }
            button {
              width: 100%;
            }

            & > span:nth-child(2) {
              align-self: center;
            }
          }
        }
      }
      .label {
        font-size: 18px;
        font-weight: 600;
        line-height: 22px;
      }
    }
  }

  .collection-container {
    margin-top: 90px;
    .header {
      display: flex;

      .title {
        text-align: initial;
        font-size: 22px;
        font-weight: 600;
        line-height: 30px;
      }

      .url {
        width: 58px;
        height: 14px;

        margin-right: 16px;
        margin-left: auto;
        margin-top: 16px;

        font-family: $item-font;
        font-style: $item-font-style;
        font-weight: 500;
        font-size: 12px;
        line-height: 14px;

        a {
          text-decoration-line: underline;
          color: $profile-border-red;
        }
      }
    }
  }
}

textarea {
  opacity: 0;
  height: 0px;
  width: 0px;
}

@media (max-width: 1440px) {
  .content-wrap {
    width: 80%;
    padding: 40px 0;
    .content-info {
      flex-direction: column-reverse;
      width: 80%;
      margin: auto;
      .right-container {
        margin-bottom: 50px;
      }
      .left-container {
        margin: 0;
      }
    }
  }
}

@media (max-width: 1080px) {
  .content-wrap {
    width: 90%;
    padding: 40px 0;
    .content-info {
      flex-direction: column-reverse;
      width: 100%;
      .right-container {
        margin-bottom: 50px;
      }
      .left-container {
        margin: 0;
      }
    }
  }
}
@media (min-width: 1440px) {
  .round-box {
    width: 708px;
  }
}
</style>
