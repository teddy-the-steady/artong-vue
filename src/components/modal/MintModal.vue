<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-header">
            <slot name="header"></slot>
          </div>

          <div
            v-for="step in steps"
            :key="step.id"
            v-show="step.id === currentStep.id"
            class="modal-body"
          >
            <slot :name="`body_step_${step.id}`" :slotData="slotData" />
          </div>

          <div class="modal-footer">
            <button
              @click="previousStep()"
              v-show="currentStep.id > 0 && currentStep.id < 5"
            >
              {{ $t('views.project.mint-modal.button.previous') }}
            </button>
            <button
              @click="nextStep()"
              v-show="currentStep.id < steps.length - 2"
            >
              <div
                class="spinner"
                :class="{ active: slotData.uploadingToS3 }"
              ></div>
              <span v-show="!slotData.uploadingToS3">
                {{ $t('views.project.mint-modal.button.next') }}
              </span>
            </button>
            <button
              @click="mint()"
              v-show="currentStep.id == steps.length - 2"
              v-ripple
            >
              {{ $t('views.project.mint-modal.button.mint') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { ethers } from 'ethers'
import { mapState } from 'vuex'
import Ripple from '../../directives/ripple/Ripple'
import { ERC721_ABI, LazyMinter } from '../../contracts'
import { patchContent, uploadToNftStorage } from '../../api/contents'
import {
  etherToWei,
  checkMobileWalletStatusAndGetSigner,
  makeS3Path,
  isSessionValid,
} from '../../util/commonFunc'
import Provider from '../../util/walletConnectProvider'

export default {
  name: 'MintModal',
  props: {
    steps: {
      type: Array,
      default: () => [],
    },
    slotData: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    currentTitle() {
      return this.currentStep.title
    },
    isMobile() {
      return this.$isMobile()
    },
    ...mapState({
      currentUser: state => state.user.currentUser,
      isModalOpen: state => state.menu.isModalOpen,
    }),
  },
  data() {
    return {
      currentStep: {
        id: this.steps[0].id,
        title: this.steps[0].title,
      },
      S3_PRIVACY_LEVEL: 'public',
    }
  },
  methods: {
    nextStep() {
      switch (this.currentStep.id) {
        case 0:
          if (this.slotData.uploadingToS3) return
          if (!this.slotData.s3Result) {
            alert(this.$i18n.t('views.project.mint-modal.alert.add-image'))
            return
          } else if (!this.slotData.postResult) {
            alert(this.$i18n.t('common.alert.error'))
            return
          }
          break
        case 1:
          if (!this.slotData.name || !this.slotData.description) {
            alert(
              this.$i18n.t('views.project.mint-modal.alert.name-desc-required'),
            )
            return
          }
          break
        case 2:
          if (this.slotData.lazyMint == 1) {
            if (!this.slotData.price || this.slotData.price < 0.001) {
              alert(this.$i18n.t('views.project.mint-modal.alert.least-price'))
              return
            }
          }
          break
        case 3:
          if (this.slotData.tokenRoyalty) {
            this.slotData.tokenRoyalty *= 100
          } else {
            this.slotData.tokenRoyalty = 0
          }
          if (
            this.slotData.tokenRoyalty < 0 ||
            this.slotData.tokenRoyalty > 10000
          ) {
            alert(
              this.$i18n.t(
                'views.project.mint-modal.alert.token-royalty-range',
              ),
            )
            return
          }
          break
        default:
          break
      }
      this.currentStep.id++
    },
    previousStep() {
      this.currentStep.id--
    },
    async mint() {
      if (!(await isSessionValid(this.$router.currentRoute.fullPath))) {
        return
      }

      this.signer = await checkMobileWalletStatusAndGetSigner(
        this.$router.currentRoute.fullPath,
      )
      if (!this.signer) {
        return
      }

      this.currentStep.id++

      const metadata = await uploadToNftStorage({
        name: this.slotData.name,
        description: this.slotData.description,
        imageKey: `${this.S3_PRIVACY_LEVEL}/${this.slotData.s3Result.key}`,
        content_id: this.slotData.postResult.id,
      })
      this.$emit('data-from-mint-modal', 'uploadedToIPFS', true)
      try {
        this.$store.commit('TOGGLE_CONFIRM_MODAL')
        const ok =
          await this.$root.$children[0].$refs.confirmModal.waitForAnswer()
        if (ok) {
          const lazyMint = this.slotData.lazyMint == 1

          if (lazyMint) {
            const voucher = await this.makeLazyMintingVoucher(
              this.slotData.postResult.project_address,
              metadata.url,
              makeS3Path(
                `${this.S3_PRIVACY_LEVEL}/${this.slotData.s3Result.key}`,
              ),
              this.slotData.tokenRoyalty,
            )

            await patchContent(this.slotData.postResult.id, {
              voucher: voucher,
              isRedeemed: false,
              ipfs_url: metadata.url,
              name: this.slotData.name,
              description: this.slotData.description,
            })
          } else {
            const contract = new ethers.Contract(
              this.slotData.postResult.project_address,
              ERC721_ABI,
              this.signer,
            )

            const tx = await this.doMint(
              contract,
              metadata.url,
              '',
              this.slotData.tokenRoyalty || 0,
            )
            const txHash = await this.signer.sendUncheckedTransaction(tx)

            const approveReceipt = await this.wait(txHash)
            const tokenId = parseInt(approveReceipt.logs[1].topics[3])

            await patchContent(this.slotData.postResult.id, {
              tokenId: tokenId,
            })

            this.$emit('data-from-mint-modal', 'tokenId', tokenId)
          }
        }
        this.$emit('data-from-mint-modal', 'minted', true)
      } catch (error) {
        if (error.message === 'Cancelled signing message') {
          this.$emit('close')
          return
        } else if (error.code === 'ACTION_REJECTED') {
          this.$emit('close')
          return
        }
        alert(this.$i18n.t('common.alert.error'))
      }
    },
    async makeLazyMintingVoucher(
      projectAddress,
      tokenUri,
      contentUri,
      royalty,
    ) {
      const lazyMinter = new LazyMinter({
        contract: new ethers.Contract(projectAddress, ERC721_ABI, this.signer),
        signer: this.signer,
      })
      const voucher = await lazyMinter.createVoucher(
        this.currentUser.wallet_address,
        tokenUri,
        contentUri,
        etherToWei(this.slotData.price),
        royalty,
      )
      return voucher
    },
    async doMint(contract, tokenUri, contentUri, tokenRoyalty) {
      const tx = await contract.populateTransaction.mint(
        this.currentUser.wallet_address,
        tokenUri,
        contentUri,
        tokenRoyalty || 0,
      )
      return tx
    },
    async wait(txHash) {
      if (this.isMobile) {
        return await Provider.mobileProvider.waitForTransaction(txHash)
      } else {
        return await Provider.pcProvider.waitForTransaction(txHash)
      }
    },
  },
  directives: {
    ripple: Ripple,
  },
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
      position: relative;
      width: 300px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      min-height: 300px;
      max-height: 450px;
      margin: auto;
      padding: 20px 30px;
      background-color: $artong-white;
      border-radius: 20px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
      transition: all 0.3s ease;
      font-family: Helvetica, Arial, sans-serif;

      .modal-header {
        align-self: flex-end;
        font-size: 20px;
        color: $lightgray;
        cursor: pointer;
      }

      .modal-body {
        overflow: hidden;
        margin: 20px 0;
      }

      .modal-footer {
        align-self: flex-end;
        display: flex;
        button {
          width: 100%;
          margin-left: 10px;
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

@media only screen and (max-width: 599px) {
  .modal-mask {
    .modal-wrapper {
      .modal-container {
        width: auto;
      }
    }
  }
}
</style>
