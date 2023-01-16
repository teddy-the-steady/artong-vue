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
            <div class="title">
              <img :src="require('@/assets/icons/100-add-folder.svg')" /> Offers
            </div>
            <table>
              <tr>
                <td>PRICE</td>
                <td>DATE</td>
                <td>FROM</td>
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
              <button class="white-button round-button ripple">
                <img src="@/assets/icons/share.svg" />
              </button>
              <button class="white-button round-button ripple">
                <img src="@/assets/icons/launch.svg" />
              </button>
              <button class="white-button round-button ripple">
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
          <div class="title">More from this collection</div>
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
import {
  makeS3Path,
  weiToEther,
  isSessionValid,
  checkMobileWalletStatusAndGetSigner,
} from '../../util/commonFunc'
import { ERC721_ABI } from '../../contracts'
import ContentsProfile from '../profile/ContentsProfile.vue'
import TokensByCollection from '../collection_card/TokensByCollection.vue'
import PromptModal from '../modal/PromptModal.vue'

export default {
  name: 'CandidateDetail',
  mixins: [headerActivate],
  components: {
    ContentsProfile,
    TokensByCollection,
    PromptModal,
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
              first: 10,
              skip: 0,
              start_num: 0,
              project: project_address,
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

      const tx = await contract.redeem(
        this.currentUser.wallet_address,
        voucher,
        { value: this.price },
      )
      const approveReceipt = await tx.wait()
      console.log(approveReceipt)
      const tokenId = parseInt(approveReceipt.events[1].args.tokenId._hex)

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
  },
  async created() {
    this.content = await getContent(
      this.$route.params.project_address,
      this.$route.params.contents_id,
    )
    await this.getContents(this.$route.params.project_address)

    this.$watch(
      () => this.$route,
      async to => {
        if (to.name === 'ContentCandidateDetail') {
          this.content = await getContent(
            this.$route.params.project_address,
            this.$route.params.contents_id,
          )
          await this.getContents(to.params.project_address)
        }
      },
    )
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
    padding: 2rem 0 4rem 0;
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
        &.history {
          margin-top: 3rem;
        }
        max-width: 90%;
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
