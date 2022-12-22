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
              Previous
            </button>
            <button
              @click="nextStep()"
              v-show="currentStep.id < steps.length - 2"
            >
              Next
            </button>
            <button
              @click="mint()"
              v-show="currentStep.id == steps.length - 2"
              v-ripple
            >
              Mint
            </button>
            walletStatus: {{ walletStatus }}<br /><br />
            walletConnect: {{ walletConnect }}<br /><br />
            getDefaultWalletConnectState: {{ getDefaultWalletConnectState }}
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { ethers } from 'ethers'
import { mapState, mapGetters } from 'vuex'
import Ripple from '../../directives/ripple/Ripple'
import {
  ERC721_ABI,
  getPcSigner,
  getWalletConnectSigner,
  LazyMinter,
} from '../../contracts'
import { patchContent, uploadToNftStorage } from '../../api/contents'
import { etherToWei } from '../../util/commonFunc'

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
      walletStatus: state => state.wallet.status,
    }),
    walletConnect() {
      return JSON.parse(localStorage.getItem('walletconnect'))?.connected
    },
    ...mapGetters({
      getDefaultWalletConnectState: 'getDefaultWalletConnectState',
    }),
  },
  data() {
    return {
      currentStep: {
        id: this.steps[0].id,
        title: this.steps[0].title,
      },
      signer: null,
      S3_PRIVACY_LEVEL: 'public',
    }
  },
  methods: {
    close() {
      this.$emit('close')
    },
    nextStep() {
      switch (this.currentStep.id) {
        case 0:
          if (!this.slotData.s3Result) {
            alert('Please add image')
            return
          } else if (!this.slotData.postResult) {
            alert('Oops, something went wrong! Please try again')
            return
          }
          break
        case 1:
          if (!this.slotData.name || !this.slotData.description) {
            alert('Name and Description required')
            return
          }
          break
        case 3:
          if (this.slotData.lazyMint == 1) {
            if (!this.slotData.price || this.slotData.price < 0.001) {
              alert('Least price is 0.001 ETH')
              return
            }
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
      if (!this.signer) {
        if (this.isMobile) {
          if (!this.walletStatus) {
            if (await this.$store.dispatch('SET_UP_WALLET_CONNECTION')) {
              this.signer = getWalletConnectSigner()
            } else {
              return
            }
          }
        } else {
          this.signer = await getPcSigner()
        }
      }

      this.currentStep.id++

      const metadata = await uploadToNftStorage({
        name: this.slotData.name,
        description: this.slotData.description,
        imageKey: `${this.S3_PRIVACY_LEVEL}/${this.slotData.s3Result.key}`,
        content_id: this.slotData.postResult.id,
      })

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
              '',
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

            const approveReceipt = await tx.wait()
            const tokenId = parseInt(approveReceipt.events[1].args.tokenId._hex)

            await patchContent(this.slotData.postResult.id, {
              tokenId: tokenId,
            })
          }
        }
      } catch (error) {
        console.log(error)
        alert('Oops, something went wrong! Please try again')
      }
    },
    async makeLazyMintingVoucher(projectAddress, tokenUri, contentUri) {
      const lazyMinter = new LazyMinter({
        contract: new ethers.Contract(projectAddress, ERC721_ABI, this.signer),
        signer: this.signer,
      })
      const voucher = await lazyMinter.createVoucher(
        this.currentUser.wallet_address,
        tokenUri,
        contentUri,
        etherToWei(this.slotData.price),
      )
      return voucher
    },
    async doMint(contract, tokenUri, contentUri, tokenRoyalty) {
      const tx = await contract.mint(
        this.currentUser.wallet_address,
        tokenUri,
        contentUri,
        tokenRoyalty || 0,
      )
      return tx
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
  height: 100%;
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
      max-height: 600px;
      margin: 0px auto;
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
        button {
          margin-left: 10px;
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
