<template>
  <div>
    <div class="content-image">
      <a
        :href="content ? makeS3Path(content.content_s3key) : ''"
        target="_blank"
      >
        <div
          v-if="isFirstLoading"
          :style="{
            height: innerWidth < 500 ? skeletonHeight : skeletonBoxHeight,
            width: skeletonBoxWidth,
          }"
        >
          <SkeletonBox
            :height="innerWidth < 500 ? '100%' : skeletonBoxHeight"
            :width="innerWidth < 500 ? '100%' : skeletonBoxWidth"
          />
        </div>
        <img v-else :src="imagePath" />
      </a>
    </div>
    <div class="content-wrap">
      <div class="content-info">
        <div class="left-container">
          <div class="round-box">
            <TableDiv
              :api="queryOffersByToken"
              :tableName="'Offers'"
              :iconSrc="require('@/assets/icons/100-add-folder.svg')"
              :showHeader="true"
              :fields="[
                {
                  name: 'PRICE',
                  type: 'price',
                  key: 'price',
                },
                {
                  name: 'FROM',
                  type: 'member',
                  key: 'from',
                },
                {
                  name: 'TIME',
                  type: 'countdown',
                  key: 'deadline',
                },
              ]"
              :key="generateKey()"
              :isCurrentUserTokenOwner="isCurrentUserTokenOwner"
              :accepting="accepting"
              @accept="acceptEmitted"
            ></TableDiv>
          </div>
          <div class="round-box">
            <TableDiv
              :api="queryTokenHistory"
              :tableName="'History'"
              :iconSrc="require('@/assets/icons/history.svg')"
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
                  name: 'From',
                  type: 'member',
                  key: 'from_member',
                },
                {
                  name: 'TO',
                  type: 'member',
                  key: 'to_member',
                },
                {
                  name: 'DATE',
                  type: 'date',
                  key: 'block_timestamp',
                },
              ]"
              :key="generateKey()"
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
                  <defs>
                    <filter id="colorFilter">
                      <feColorMatrix
                        color-interpolation-filters="sRGB"
                        type="matrix"
                        values="0 0 0 0 0.95 0 0 0 0 0.18 0 0 0 0 0.24 0 0 0 1 0"
                      />
                    </filter>
                  </defs>

                  <g :class="{ like: isLikeTrue }" :style="likeStyle">
                    <path
                      d="M2.42602 9.31146L10 16.8854L17.574 9.31146C19.4753 7.4101 19.4753 4.32738 17.574 2.42602C15.6726 0.52466 12.5899 0.52466 10.6885 2.42602L10 3.11456L9.31146 2.42602C7.4101 0.52466 4.32738 0.52466 2.42602 2.42602C0.52466 4.32738 0.52466 7.4101 2.42602 9.31146Z"
                      stroke="black"
                      stroke-width="2"
                      stroke-linejoin="round"
                    />
                  </g>
                </svg>
              </button>
              <button class="white-button round-button ripple" @click="share">
                <img src="@/assets/icons/share.svg" />
              </button>
              <button
                class="white-button round-button ripple"
                @click="toEtherscan"
              >
                <img src="@/assets/icons/launch.svg" />
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
              tag="div"
              class="profile-link"
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
                tag="div"
                class="profile-link"
                :to="{
                  name: 'Project',
                  params: { id: content ? content.project.id : null },
                }"
              >
                <ProjectPageProfile_small
                  :project="content ? content.project : null"
                  :isFirstLoading="isFirstLoading"
                ></ProjectPageProfile_small>
              </router-link>
            </div>
            <div class="info">
              <div class="label">Created By</div>
              <router-link
                tag="div"
                class="profile-link"
                :to="{
                  name: 'UserOrArtist',
                  params: { id: content ? content.creator.username : '' },
                }"
              >
                <ContentsProfile
                  :member="content ? content.creator : null"
                  :needUserName="true"
                  :isFirstLoading="isFirstLoading"
                ></ContentsProfile>
              </router-link>
            </div>
          </div>
          <div class="description">
            <div class="label">Description</div>
            <div>
              {{ content ? content.description : '' }}
            </div>
          </div>
          <div class="price-box">
            <div class="label">Price</div>
            <div>
              {{ price ? weiToEther(price) : '' }}
              ETH
            </div>
          </div>
          <div class="trade-buttons">
            <div v-if="content ? isCurrentUserTokenOwner : false">
              <button v-if="!isListed" @click="makeTransaction('sell')">
                Sell
              </button>
              <div v-else>
                <button @click="makeTransaction('update')">
                  Update Listing
                </button>
                <button @click="makeTransaction('cancel')" class="white-button">
                  <div class="spinner" :class="{ active: canceling }"></div>
                  <span v-show="!canceling">Cancel Listing</span>
                </button>
              </div>
            </div>
            <div v-else>
              <button v-if="isListed" @click="makeTransaction('buy')">
                <div class="spinner" :class="{ active: buying }"></div>
                <span v-show="!buying">Buy</span>
              </button>
              <button @click="makeTransaction('offer')" class="white-button">
                Make offer
              </button>
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
                params: { id: content ? content.project.id : null },
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
      <div class="collection-container">
        <div class="header">
          <div class="title">Discover projects</div>
        </div>
        <div>
          <CuratedCollection :projects="projects" />
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
import {
  graphql,
  queryToken,
  queryOffersByToken,
  queryTokenHistory,
  queryTokensByProject,
} from '../../api/graphql'
import { postContentReactions } from '../../api/contents'
import { getProjectsPrevNext } from '../../api/projects'
import {
  makeS3Path,
  etherToWei,
  weiToEther,
  isSessionValid,
  checkMobileWalletStatusAndGetSigner,
} from '../../util/commonFunc'
import { MARKETPLACE_ABI, MARKETPLACE } from '../../contracts'
import Provider from '../../util/walletConnectProvider'
import ContentsProfile from '../profile/ContentsProfile.vue'
import TokensByCollection from '../collection_card/TokensByCollection.vue'
import PromptModal from '../modal/PromptModal.vue'
import TableDiv from '../table/TableDiv.vue'
import ProjectPageProfile_small from '../profile/ProjectPageProfile_small.vue'
import BasicDialog from '../dialog/BasicDialog.vue'
import CuratedCollection from '../collection_card/CuratedCollection.vue'
import SkeletonBox from '../util/SkeletonBox.vue'

export default {
  name: 'ContentDetail',
  mixins: [headerActivate],
  components: {
    ContentsProfile,
    TokensByCollection,
    PromptModal,
    TableDiv,
    ProjectPageProfile_small,
    BasicDialog,
    CuratedCollection,
    SkeletonBox,
  },
  data() {
    return {
      content: null,
      tokens: [],
      projects: [],
      signer: null,
      confirmOnProcess: false,
      cancelDisabled: false,
      buying: false,
      canceling: false,
      accepting: false,
      queryOffersByToken: {
        func: null,
        body: {},
      },
      queryTokenHistory: {
        func: null,
        body: {},
      },
      isFirstLoading: true,
      isDialogActive: false,
      isMouseDownOnMore: false,
      isMouseUpOnMore: false,
      url: '',
      skeletonHeight: '100px',
      skeletonBoxWidth: '100%',
      skeletonBoxHeight: '100%',
    }
  },
  computed: {
    ...mapState({
      currentUser: state => state.user.currentUser,
      isModalOpen: state => state.menu.isModalOpen,
      innerWidth: state => state.menu.innerWidth,
    }),
    isListed() {
      const eventType = this.content?.listings[0]?.eventType
      return eventType === 'LISTED' || eventType === 'UPDATED'
    },
    isMobile() {
      return this.$isMobile()
    },
    isCurrentUserTokenOwner() {
      return (
        this.currentUser.wallet_address === this.content?.owner.wallet_address
      )
    },
    price() {
      if (this.isListed) {
        return this.content?.listings[0]?.price
      } else {
        return ''
      }
    },
    imagePath() {
      return (
        this.makeS3Path(this.content?.content_thumbnail_s3key) ||
        this.makeS3Path(this.content?.content_s3key)
      )
    },
    isLikeTrue() {
      return this.content ? (this.content.like ? true : false) : false
    },
    likeStyle() {
      return {
        '--filter': 'url(#colorFilter)',
        '--fill': '#F22E3E',
      }
    },
  },
  methods: {
    async queryToken(project_address, token_id) {
      const result = await graphql(
        queryToken({
          variables: {
            id: project_address + token_id,
          },
          db: {
            project_address: project_address,
            token_id: token_id,
          },
        }),
      )

      return result.token
    },
    async getCarouselData(project_address) {
      const [prevNextProjects, tokensByProject] = await Promise.all([
        getProjectsPrevNext(project_address, 4),
        graphql(
          queryTokensByProject({
            variables: {
              first: 8,
              skip: 0,
              start_num: 0,
              project: project_address,
              orderBy: 'createdAt',
              orderDirection: 'desc',
            },
          }),
        ),
      ])

      this.projects = prevNextProjects
      this.tokens = tokensByProject.tokens
    },
    toggleModal() {
      this.$store.commit('TOGGLE_MODAL')
    },
    async makeTransaction(which, acceptParam) {
      if (this.canceling || this.buying || this.accepting) {
        return
      }

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
        MARKETPLACE,
        MARKETPLACE_ABI,
        this.signer,
      )

      switch (which) {
        case 'sell': {
          this.toggleModal()
          await this.$nextTick()
          for (;;) {
            try {
              const newPrice = await this.$refs.promptModal.waitForAnswer()
              this.confirmOnProcess = true
              const txHash = await this.sell(contract, newPrice)
              await this.wait(txHash)
              alert('listed!')
              break
            } catch (error) {
              if (error.message === 'canceled') {
                break
              }
            } finally {
              this.confirmOnProcess = false
              this.cancelDisabled = false
            }
          }
          this.toggleModal()
          break
        }
        case 'buy': {
          try {
            this.buying = true
            const txHash = await this.buy(contract)
            await this.wait(txHash)
            alert('purchased!')
          } finally {
            this.buying = false
          }
          break
        }
        case 'cancel': {
          try {
            this.canceling = true
            const txHash = await this.cancel(contract)
            await this.wait(txHash)
            alert('canceled!')
          } finally {
            this.canceling = false
          }
          break
        }
        case 'update': {
          this.toggleModal()
          await this.$nextTick()
          for (;;) {
            try {
              const newPrice = await this.$refs.promptModal.waitForAnswer()
              this.confirmOnProcess = true
              const txHash = await this.update(contract, newPrice)
              await this.wait(txHash)
              alert('updated!')
              break
            } catch (error) {
              if (error.message === 'canceled') {
                break
              }
            } finally {
              this.confirmOnProcess = false
              this.cancelDisabled = false
            }
          }
          this.toggleModal()
          break
        }
        case 'offer': {
          this.toggleModal()
          await this.$nextTick()
          for (;;) {
            try {
              const offerPrice = await this.$refs.promptModal.waitForAnswer()
              this.confirmOnProcess = true
              const txHash = await this.offer(contract, offerPrice)
              await this.wait(txHash)
              alert('offered!')
              break
            } catch (error) {
              if (error.message === 'canceled') {
                break
              }
            } finally {
              this.confirmOnProcess = false
              this.cancelDisabled = false
            }
          }
          this.toggleModal()
          break
        }
        case 'accept': {
          try {
            this.accepting = true
            const txHash = await this.accept(contract, acceptParam)
            await this.wait(txHash)
            alert('accepted!')
          } finally {
            this.accepting = false
          }
          break
        }
        default:
          break
      }
    },
    async buy(contract) {
      const tx = await contract.populateTransaction.buyItem(
        this.content.project.id,
        this.content.tokenId,
        this.content.owner.wallet_address,
        { value: this.price },
      )
      const txHash = await this.signer.sendUncheckedTransaction(tx)
      return txHash
    },
    async cancel(contract) {
      const tx = await contract.populateTransaction.cancelListing(
        this.content.project.id,
        this.content.tokenId,
      )
      const txHash = await this.signer.sendUncheckedTransaction(tx)
      return txHash
    },
    async sell(contract, newPrice) {
      this.cancelDisabled = true
      const tx = await contract.populateTransaction.listItem(
        this.content.project.id,
        this.content.tokenId,
        etherToWei(newPrice),
      )
      const txHash = await this.signer.sendUncheckedTransaction(tx)
      return txHash
    },
    async update(contract, newPrice) {
      this.cancelDisabled = true
      const tx = await contract.populateTransaction.updateListing(
        this.content.project.id,
        this.content.tokenId,
        etherToWei(newPrice),
      )
      const txHash = await this.signer.sendUncheckedTransaction(tx)
      return txHash
    },
    async offer(contract, offerPrice) {
      this.cancelDisabled = true
      const tx = await contract.populateTransaction.createOffer(
        this.content.project.id,
        this.content.tokenId,
        1,
        { value: etherToWei(offerPrice) },
      )
      const txHash = await this.signer.sendUncheckedTransaction(tx)
      return txHash
    },
    async accept(contract, offeror_address) {
      const tx = await contract.populateTransaction.acceptOffer(
        this.content.project.id,
        this.content.tokenId,
        offeror_address,
      )
      const txHash = await this.signer.sendUncheckedTransaction(tx)
      return txHash
    },
    acceptEmitted(offeror_address) {
      this.makeTransaction('accept', offeror_address)
    },
    makeS3Path(path) {
      return makeS3Path(path)
    },
    weiToEther(wei) {
      return weiToEther(wei)
    },
    async wait(txHash) {
      if (this.isMobile) {
        return await Provider.mobileProvider.waitForTransaction(txHash)
      } else {
        return await Provider.pcProvider.waitForTransaction(txHash)
      }
    },
    generateKey() {
      return this.$route.params.project_address + this.$route.params.token_id
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
    toEtherscan() {
      window.open(
        `${process.env.VUE_APP_ETHER_SCAN_URL}nft/${this.content.project.id}/${this.content.tokenId}`,
      )
    },
  },
  async created() {
    this.skeletonBoxWidth = this.$route.params.image_width + 'px'
    this.skeletonBoxHeight = this.$route.params.image_height + 'px'

    const ratio =
      this.$route.params.image_height / this.$route.params.image_width
    this.skeletonHeight = this.innerWidth * ratio + 'px'

    this.queryOffersByToken = {
      result_key: 'offers',
      func: graphql,
      body: queryOffersByToken({
        variables: {
          first: 5,
          skip: 0,
          id: this.$route.params.project_address + this.$route.params.token_id,
          project_address: this.$route.params.project_address,
          token_id: this.$route.params.token_id,
        },
      }),
    }
    this.queryTokenHistory = {
      result_key: 'history',
      func: graphql,
      body: queryTokenHistory({
        variables: {
          id: this.$route.params.project_address + this.$route.params.token_id,
          project_address: this.$route.params.project_address,
          token_id: this.$route.params.token_id,
        },
        pagination: {
          start_num: 0,
          count_num: 5,
        },
      }),
    }
    this.isFirstLoading = true
    this.content = await this.queryToken(
      this.$route.params.project_address,
      this.$route.params.token_id,
    )
    this.isFirstLoading = false
    await this.getCarouselData(this.$route.params.project_address)

    this.$watch(
      () => this.$route,
      async to => {
        if (to.name === 'ContentDetail') {
          this.isFirstLoading = true
          this.content = await this.queryToken(
            to.params.project_address,
            to.params.token_id,
          )
          this.isFirstLoading = false
          await this.getCarouselData(to.params.project_address)
        }
      },
    )
  },
  watch: {
    $route(to) {
      this.skeletonBoxWidth = to.params.image_width + 'px'
      this.skeletonBoxHeight = to.params.image_height + 'px'

      const ratio = to.params.image_height / to.params.image_width
      this.skeletonHeight = this.innerWidth * ratio + 'px'

      this.queryOffersByToken = {
        result_key: 'offers',
        func: graphql,
        body: queryOffersByToken({
          variables: {
            first: 5,
            skip: 0,
            id: to.params.project_address + to.params.token_id,
            project_address: to.params.project_address,
            token_id: to.params.token_id,
          },
        }),
      }
      this.queryTokenHistory = {
        result_key: 'history',
        func: graphql,
        body: queryTokenHistory({
          variables: {
            id: to.params.project_address + to.params.token_id,
            project_address: to.params.project_address,
            token_id: to.params.token_id,
          },
          pagination: {
            start_num: 0,
            count_num: 5,
          },
        }),
      }
    },

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
    div {
      width: 100%;
      max-height: 60vh;
      overflow: hidden;
    }
    img {
      object-fit: contain;
      max-width: 100%;
    }
  }
}
.content-wrap {
  max-width: 1440px;
  padding: 40px 24px 0 24px;
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
      text-align: initial;
      flex: 1;
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

          g {
            &.like {
              filter: var(--filter);
              fill: var(--fill);
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
        .info {
          width: 50%;
        }
      }
      .description {
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
      .profile-link {
        cursor: pointer;
        width: fit-content;
        min-width: 100px;
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
