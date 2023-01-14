<template>
  <div>
    <div class="content-image">
      <img
        :src="
          content
            ? makeS3Path(content.content_s3key) ||
              makeS3Path(content.content_thumbnail_s3key) ||
              content.contentURI.replace('ipfs://', 'https://ipfs.io/ipfs/')
            : ''
        "
        @click="imageZoomIn"
      />
    </div>
    <div class="content-wrap">
      <div class="content-info">
        <div class="left-container">
          <div class="round-box">
            <div class="title">
              <img :src="require('@/assets/icons/100-add-folder.svg')" /> Offers
            </div>
            <table>
              <tr>
                <td>PRICE</td>
                <td>DATE</td>
                <td>FROM</td>
              </tr>
              <tr v-for="(val, i) in offers" :key="i">
                <td class="price">
                  {{ weiToEther(val.price) }}
                  ETH
                </td>
                <td class="record">
                  {{ convertDay(val.createdAt) }}
                </td>
                <td class="recent">
                  <ContentsProfile
                    :member="val.from"
                    :needUserName="true"
                  ></ContentsProfile>
                </td>
              </tr>
            </table>
          </div>
          <div class="round-box history">
            <div class="title">
              <img :src="require('@/assets/icons/100-add-folder.svg')" />
              History
            </div>
            <table>
              <tr>
                <td>PRICE</td>
                <td>FROM</td>
                <td>TO</td>
                <td>DATE</td>
              </tr>
              <tr v-for="(val, i) in histories" :key="i">
                <td class="price">
                  <!--
                  {{ weiToEther(val.price) }}
                  ETH
                  <img
                    :src="require('@/assets/icons/launch.svg')"
                    @click="action('price')"
                  />
                  -->
                </td>
                <td class="recent">
                  <ContentsProfile
                    :member="val.from_member"
                    :needUserName="true"
                  ></ContentsProfile>
                </td>
                <td class="recent">
                  <ContentsProfile
                    v-if="val.to_member"
                    :member="val.to_member"
                    :needUserName="true"
                  ></ContentsProfile>
                </td>
                <td class="record">
                  {{ convertDay(val.block_timestamp) }}
                </td>
              </tr>
            </table>
          </div>
        </div>
        <div class="right-container">
          <div class="add-info">
            <div class="like-view">
              <div><img src="@/assets/icons/share.svg" /></div>
              <div>1,000</div>
              <div><img src="@/assets/icons/launch.svg" /></div>
              <div>2000</div>
            </div>
            <div class="buttons">
              <button class="round-button ripple">
                <img src="@/assets/icons/share.svg" />
              </button>
              <button class="round-button ripple">
                <img src="@/assets/icons/launch.svg" />
              </button>
              <button class="round-button ripple">
                <img src="@/assets/icons/more.svg" />
              </button>
            </div>
          </div>
          <div class="name">
            {{ content ? content.name : '' }}
          </div>
          <div class="owner">
            <div class="label">Owned by</div>
            <div>
              <ContentsProfile
                :member="content ? content.owner : null"
                :needUserName="true"
              ></ContentsProfile>
            </div>
          </div>
          <div class="collection">
            <div class="info">
              <div class="label">Collection</div>
              <div class="profile">img</div>
            </div>
            <div>
              <div class="label">Created By</div>
              <div class="profile">img</div>
            </div>
          </div>
          <div class="information">
            <div class="label">Information</div>
            <div>
              {{ content ? content.description : '' }}
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ac sit
              lorem vel magna id. Enim feugiat felis at ultrices a dolor amet,
              tincidunt in. Cursus volutpat convallis turpis elementum. Fusce
              morbi sit diam arcu.
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
                <button @click="makeTransaction('cancel')" class="white-btn">
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
              <button @click="makeTransaction('offer')" class="white-btn">
                Make offer
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="collection-container">
        <div class="header">
          <div class="title">More from this collection</div>
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
    </div>
    <PromptModal
      v-if="isModalOpen"
      @close-modal="toggleModal"
      :confirmOnProcess="confirmOnProcess"
      :cancelDisabled="cancelDisabled"
      ref="promptModal"
    ></PromptModal>
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
import {
  makeS3Path,
  etherToWei,
  weiToEther,
  isSessionValid,
  checkMobileWalletStatusAndGetSigner,
} from '../../util/commonFunc'
import { MARKETPLACE_ABI, MARKETPLACE } from '../../contracts'
import ContentsProfile from '../profile/ContentsProfile.vue'
import TokensByCollection from '../collection_card/TokensByCollection.vue'
import PromptModal from '../modal/PromptModal.vue'

export default {
  name: 'ContentDetail',
  mixins: [headerActivate],
  components: {
    ContentsProfile,
    TokensByCollection,
    PromptModal,
  },
  data() {
    return {
      content: null,
      offers: [],
      histories: [],
      tokens: [],
      signer: null,
      confirmOnProcess: false,
      cancelDisabled: false,
      buying: false,
      canceling: false,
    }
  },
  computed: {
    ...mapState({
      currentUser: state => state.user.currentUser,
      isModalOpen: state => state.menu.isModalOpen,
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
        this.currentUser.wallet_address === this.content.owner.wallet_address
      )
    },
    price() {
      if (this.isListed) {
        return this.content?.listings[0]?.price
      } else {
        return ''
      }
    },
  },
  methods: {
    async getContents(project_address, token_id) {
      const [token, offers, histories, tokensByProject] = await Promise.all([
        graphql(
          queryToken({
            variables: {
              id: project_address + token_id,
            },
            db: {
              project_address: project_address,
              token_id: token_id,
            },
          }),
        ),
        graphql(
          queryOffersByToken({
            variables: {
              id: project_address + token_id,
            },
          }),
        ),
        graphql(
          queryTokenHistory({
            variables: {
              id: project_address + token_id,
            },
            pagination: {
              start_num: 0,
              count_num: 5,
            },
          }),
        ),
        graphql(
          queryTokensByProject({
            variables: {
              first: 10,
              skip: 0,
              start_num: 0,
              project: project_address,
            },
          }),
        ),
      ])

      this.content = token.token
      this.offers = offers.offers
      this.histories = histories
      this.tokens = tokensByProject.tokens
    },
    toggleModal() {
      this.$store.commit('TOGGLE_MODAL')
    },
    async makeTransaction(which) {
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
              await this.sell(contract, newPrice)
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
            await this.buy(contract)
          } finally {
            this.buying = false
          }
          break
        }
        case 'cancel': {
          try {
            this.canceling = true
            await this.cancel(contract)
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
              await this.update(contract, newPrice)
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
              await this.offer(contract, offerPrice)
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
        // case 'accept': {
        //   const tx = await contract.acceptOffer(
        //     this.content.project.id,
        //     this.content.tokenId,
        //     acceptParam,
        //   )
        //   await tx.wait()
        //   alert('accepted!')
        //   break
        // }
        default:
          break
      }
    },
    async buy(contract) {
      const tx = await contract.buyItem(
        this.content.project.id,
        this.content.tokenId,
        this.content.owner.wallet_address,
        { value: this.price },
      )
      await tx.wait()
      alert('purchased!')
    },
    async cancel(contract) {
      const tx = await contract.cancelListing(
        this.content.project.id,
        this.content.tokenId,
      )
      await tx.wait()
      alert('canceled!')
    },
    async sell(contract, newPrice) {
      this.cancelDisabled = true
      const tx = await contract.listItem(
        this.content.project.id,
        this.content.tokenId,
        etherToWei(newPrice),
      )
      await tx.wait()
      alert('listed!')
    },
    async update(contract, newPrice) {
      this.cancelDisabled = true
      const tx = await contract.updateListing(
        this.content.project.id,
        this.content.tokenId,
        etherToWei(newPrice),
      )
      await tx.wait()
      alert('updated!')
    },
    async offer(contract, offerPrice) {
      this.cancelDisabled = true
      const tx = await contract.createOffer(
        this.content.project.id,
        this.content.tokenId,
        1,
        { value: etherToWei(offerPrice) },
      )
      await tx.wait()
      alert('offered!')
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
    imageZoomIn(event) {
      const element = event.target
      if (document.fullscreenElement) {
        return document.exitFullscreen()
      }
      if (element.requestFullscreen) {
        element.requestFullscreen()
      }
    },
  },
  async created() {
    await this.getContents(
      this.$route.params.project_address,
      this.$route.params.token_id,
    )

    this.$watch(
      () => this.$route,
      async to => {
        if (to.name === 'ContentDetail') {
          await this.getContents(to.params.project_address, to.params.token_id)
        }
      },
    )
  },
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/variables';
.content-image {
  display: flex;
  justify-content: center;
  max-height: 60vh;
  padding: 2rem 0 4rem 0;
  background: #f2f2f2;

  img {
    object-fit: contain;
    max-width: 100%;
    cursor: pointer;
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
        &.history {
          margin-top: 3rem;
        }
        border: 1px solid #f2f2f2;
        box-shadow: 2px 2px 12px rgba(0, 0, 0, 0.14);
        border-radius: 24px;
        padding: 32px 24px 32px 24px;

        .title {
          text-align: initial;
          margin-left: 1rem;
          font-size: 22px;
          font-weight: 600;
          img {
            max-width: 1.8rem;
            vertical-align: text-top;
          }
        }

        table {
          width: 100%;
          border-collapse: collapse;
          th {
            font-weight: 50;
          }

          td {
            border-bottom: 1px solid #cccccc;
            padding: 21px;
            text-align: left;

            font-family: $item-font;
            font-style: $item-font-style;
            font-weight: 500;
            font-size: 14px;

            &.price {
              img {
                margin-left: 0.5rem;
                cursor: pointer;
                opacity: 0.5;
                vertical-align: middle;
              }
            }
          }
        }
      }
    }

    .right-container {
      flex: 1;
      text-align: initial;
      .add-info {
        display: flex;
        .like-view {
          flex: 1;
          display: flex;
        }

        .buttons {
          display: flex;
          justify-content: space-between;

          img {
            position: absolute;
          }

          button {
            .dialog {
              display: none;
              top: 110%;
              &.active {
                display: block;
              }
            }
          }
        }
      }

      .name {
        margin-bottom: 20px;
        font-size: 32px;
        font-weight: 600;
      }
      .owner {
        display: flex;
      }
      .collection {
        display: flex;
        margin-top: 30px;
        .info {
          flex: 0.5;
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
</style>
