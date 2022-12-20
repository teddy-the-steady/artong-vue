<template>
  <div>
    <div class="content-image">
      <img
        :src="
          makeS3Path(content.content_thumbnail_s3key) ||
          makeS3Path(content.content_s3key) ||
          this.content.contentURI.replace('ipfs://', 'https://ipfs.io/ipfs/')
        "
        @error="replaceImage"
      />
    </div>
    <div class="content-wrap">
      <div class="content-info">
        <div class="left-container" style="flex: 1">
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
                  <img
                    :src="require('@/assets/icons/launch.svg')"
                    @click="action('price')"
                  />
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
            <div class="social-buttons">
              <div class="buttons">
                <!-- heart -->
                <div class="round-button">
                  <img src="@/assets/icons/share.svg" />
                </div>
                <!-- refresh -->
                <div class="round-button">
                  <img src="@/assets/icons/launch.svg" />
                </div>
                <div class="round-button">
                  <img src="@/assets/icons/share.svg" />
                </div>
                <div class="round-button">
                  <img src="@/assets/icons/launch.svg" />
                </div>
                <div class="round-button">
                  <img src="@/assets/icons/more.svg" />
                </div>
                <!--
                <div v-if="this.width >= 1080" class="creators-button">
                  <div class="creator">Creator</div>
                  <ContentsProfileBundle class="profile-bundle" />
                  <div class="viewAll">View all</div>
                </div>
                -->
              </div>
            </div>
          </div>
          <div class="name">
            {{ content.name }}
          </div>
          <div class="owner">
            <div class="label">Owned by</div>
            <div>
              <ContentsProfile
                :member="content.owner"
                :needUserName="true"
              ></ContentsProfile>
            </div>
          </div>
          <div class="collection d-flex">
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
              {{ content.description }}
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ac sit
              lorem vel magna id. Enim feugiat felis at ultrices a dolor amet,
              tincidunt in. Cursus volutpat convallis turpis elementum. Fusce
              morbi sit diam arcu.
            </div>
          </div>
          <div class="price-box">
            <div class="label">Price</div>
            <div>
              <input type="text" v-model="price" placeholder="price in ETH" />
              ETH
            </div>
          </div>
          <div v-if="content.owner === currentUser.wallet_address">
            <div class="buyNSell-container d-flex">
              <div class="flex-1">
                <div
                  class="btn btn-buy"
                  v-if="isListed"
                  @click="action('sell')"
                >
                  Sell
                </div>
                <div v-else @click="action('cancel')">
                  Cancel/Update Listing
                </div>
              </div>
            </div>
          </div>
          <div v-else>
            <div class="buyNSell-container d-flex">
              <div class="flex-1">
                <div class="btn btn-buy" v-if="isListed" @click="action('buy')">
                  Buy
                </div>
              </div>
              <div class="flex-1">
                <div class="btn" @click="action('offer')">Make offer</div>
              </div>
            </div>
          </div>

          <div v-if="content.owner === currentUser.wallet_address">
            <button v-if="!isListed" @click="action('sell')">Sell</button>
            <button v-else @click="action('cancel')">
              Cancel/Update Listing
            </button>
          </div>
        </div>
      </div>
      <div class="collection-container">
        <div class="header">
          <div class="title">More from this collection</div>
          <div class="url">
            <router-link
              :to="{ name: 'Project', params: { id: content.project.id } }"
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
    <div>
      {{ content }}
      <div v-if="content.owner === currentUser.wallet_address">
        <button v-if="!isListed" @click="action('sell')">Sell</button>
        <button v-else @click="action('cancel')">Cancel/Update Listing</button>
      </div>
      <div v-else>
        <button v-if="isListed" @click="action('buy')">Buy</button>
        <button @click="action('offer')">Make offer</button>
      </div>

      <input type="text" v-model="price" placeholder="price in ETH" />

      <div>
        OFFER LIST
        <ul v-for="(val, i) in offers" :key="i">
          CREATED:
          {{
            new Date(val.createdAt * 1000)
          }}
          / Offeror:
          {{
            val.from
          }}
          / Price:
          {{
            weiToEther(val.price)
          }}
          ETH / isAccepted:
          {{
            val.isAccepted
          }}
          / Deadline:
          {{
            new Date(val.deadline * 1000)
          }}
          <button
            v-if="
              isCurrentUserTokenOwner &&
              !val.isAccepted &&
              new Date(val.deadline * 1000) > new Date()
            "
            @click="action('accept', val.from.wallet_address)"
          >
            Accept Offer
          </button>
          <button v-if="isCurrentUserTokenOwner && val.isAccepted">
            Accepted
          </button>
          <button
            v-if="
              isCurrentUserTokenOwner &&
              new Date(val.deadline * 1000) <= new Date()
            "
          >
            Expired
          </button>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { ethers } from 'ethers'
import { mapState } from 'vuex'
import { headerActivate } from '../../mixin'
import baseLazyLoading from '../../util/baseLazyLoading'
import {
  graphql,
  queryToken,
  queryOffersByToken,
  queryTokenHistory,
  queryTokensByProject,
} from '../../api/graphql'
import { makeS3Path, etherToWei, weiToEther } from '../../util/commonFunc'
import ContentsProfile from '../profile/ContentsProfile.vue'
import TokensByCollection from '../collection_card/TokensByCollection.vue'
import {
  MARKETPLACE_ABI,
  MARKETPLACE,
  getPcSigner,
  getWalletConnectSigner,
} from '../../contracts'

export default {
  name: 'ContentDetail',
  mixins: [headerActivate],
  components: {
    ContentsProfile,
    TokensByCollection,
  },
  data() {
    return {
      content: null,
      price: null,
      offers: [],
      histories: [],
      tokens: [],
    }
  },
  computed: {
    ...mapState({
      currentUser: state => state.user.currentUser,
    }),
    isListed() {
      const eventType = this.content?.listings[0]?.eventType
      return eventType === 'LISTED' || eventType === 'UPDATED'
    },
    isMobile() {
      return this.$isMobile()
    },
    isCurrentUserTokenOwner() {
      return this.currentUser.wallet_address === this.content.owner
    },
  },
  extends: baseLazyLoading(async (to, callback) => {
    const [result1, result2, result3, result4] = await Promise.all([
      await graphql(
        queryToken({
          variables: {
            id: to.params.project_address + to.params.token_id,
          },
          db: {
            project_address: to.params.project_address,
            token_id: to.params.token_id,
          },
        }),
      ),
      await graphql(
        queryOffersByToken({
          variables: {
            id: to.params.project_address + to.params.token_id,
          },
        }),
      ),
      await graphql(
        queryTokenHistory({
          variables: {
            id: to.params.project_address + to.params.token_id,
          },
          pagination: {
            start_num: 0,
            count_num: 5,
          },
        }),
      ),
      await graphql(
        queryTokensByProject({
          variables: {
            first: 10,
            skip: 0,
            project: to.params.project_address,
          },
        }),
      ),
    ])
    callback(function () {
      console.log(['result4', result1, result4])
      this.content = result1.token
      this.offers = result2.offers
      this.histories = result3
      this.tokens = result4.tokens
    })
  }),
  methods: {
    async action(which, acceptParam) {
      // TODO] 모달로 바꾸기
      let signer = null

      if (this.isMobile) {
        signer = await getWalletConnectSigner()
      } else {
        signer = await getPcSigner()
      }

      const contract = new ethers.Contract(MARKETPLACE, MARKETPLACE_ABI, signer)
      switch (which) {
        case 'sell': {
          const tx = await contract.listItem(
            this.content.project.id,
            this.content.tokenId,
            etherToWei(this.price),
          )
          await tx.wait()
          alert('listed!')
          break
        }
        case 'buy': {
          const tx = await contract.buyItem(
            this.content.project.id,
            this.content.tokenId,
            this.content.owner,
            { value: etherToWei(this.price) },
          )
          await tx.wait()
          alert('purchased!')
          break
        }
        case 'cancel': {
          const tx = await contract.cancelListing(
            this.content.project.id,
            this.content.tokenId,
          )
          await tx.wait()
          alert('canceled!')
          break
        }
        case 'update': {
          const tx = await contract.updateListing(
            this.content.project.id,
            this.content.tokenId,
            etherToWei(this.price),
          )
          await tx.wait()
          alert('updated!')
          break
        }
        case 'offer': {
          const tx = await contract.createOffer(
            this.content.project.id,
            this.content.tokenId,
            1,
            { value: etherToWei(this.price) },
          )
          await tx.wait()
          alert('offered!')
          break
        }
        case 'accept': {
          const tx = await contract.acceptOffer(
            this.content.project.id,
            this.content.tokenId,
            acceptParam,
          )
          await tx.wait()
          alert('accepted!')
          break
        }
        case 'price': {
          // TODO] 이동 경로??
          break
        }
        default:
          break
      }
    },
    replaceImage(e) {
      const imageUrl = e.target.currentSrc
      if (imageUrl.indexOf('resized-') > -1) {
        e.target.src = this.content.content_s3key
      } else {
        e.target.src = this.content.contentURI.replace(
          'ipfs://',
          'https://ipfs.io/ipfs/',
        )
      }
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
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/variables';
.d-flex {
  display: flex;
}
.flex-1 {
  flex: 1;
}
.content-image {
  display: flex;
  justify-content: center;
  padding: 2rem 0 4rem 0;
  background: #f2f2f2;
}
.content-wrap {
  width: 100%;
  max-width: 1440px;
  padding: 40px 64px 0 64px;
  margin: 0 auto;
}
.content-info {
  display: flex;
  flex-direction: row;

  .left-container {
    flex: 1;
    .round-box {
      &.history {
        margin-top: 3rem;
      }
      //min-height: 425px;
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
        //border-top: 1px solid #444444;
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
    }
    .social-buttons {
      display: flex;
      .buttons {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        transform: translateY(-24px);
        margin-right: 16px;
        width: 260px;
        .round-button {
          width: 48px;
          height: 48px;
          background: #ffffff;
          border: 1px solid #f2f2f2;
          box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.08);
          border-radius: 999px;
          // img 중앙정렬
          display: flex;
          justify-content: center;
          img {
            margin-top: auto;
            margin-bottom: auto;
          }
        }
        .creators-button {
          width: 258px;
          height: 48px;
          background: #ffffff;
          border: 1px solid #f2f2f2;
          box-shadow: 2px 2px 12px rgba(0, 0, 0, 0.14);
          border-radius: 999px;
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
          .creator {
            font-family: 'Pretendard';
            font-style: normal;
            font-weight: 500;
            font-size: 14px;
            color: #000000;
          }
          .profile-bundle {
            margin-bottom: 0px;
            margin-left: 6px;
            transform: translateX(5px);
          }
          .viewAll {
            font-family: 'Pretendard';
            font-style: normal;
            font-weight: 400;
            font-size: 12px;
            color: #808080;
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
      margin-top: 30px;
      .info {
        flex: 0.5;
      }
      .profile {
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
    .buyNSell-container {
      margin-top: 30px;
      justify-items: center;
      .btn {
        border: 1px solid black;
        cursor: pointer;
        border-radius: 5px;
        padding: 15px 24px 16px;
        text-align: center;
        gap: 8px;
        width: calc(98% - 48px);
      }
      .btn-buy {
        background-color: black;
        color: white;
      }
      .btn-offer {
        background-color: white;
        color: black;
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
</style>
