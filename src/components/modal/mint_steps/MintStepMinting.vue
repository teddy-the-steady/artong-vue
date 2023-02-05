<template>
  <div>
    <div class="text inProgress" v-if="!uploadedToIPFS">Uploading to IPFS</div>
    <div class="text inProgress" v-else-if="uploadedToIPFS && !minted">
      Minting
    </div>
    <div class="text" v-else-if="minted">
      <div>Complete!</div>
      <button @click="redirectToMintResult">Click</button> to see result
    </div>
    <div>
      <div
        class="spinner"
        :class="{
          active: !uploadedToIPFS || !minted,
        }"
      ></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MintStepMinting',
  props: {
    uploadedToIPFS: {
      type: Boolean,
      default: false,
    },
    minted: {
      type: Boolean,
      default: false,
    },
    slotData: {
      type: Object,
      default: () => {},
    },
    project: {
      type: Object,
      default: () => {},
    },
  },
  methods: {
    redirectToMintResult() {
      if (this.slotData.lazyMint === '0') {
        this.$router.push({
          name: 'ContentDetail',
          params: {
            project_address:
              this.project.slug || this.slotData.postResult.project_address,
            token_id: this.slotData.tokenId,
            image_width: 500,
            image_height: 500,
          },
        })
      } else {
        this.$router.push({
          name: 'ContentCandidateDetail',
          params: {
            project_address:
              this.project.slug || this.slotData.postResult.project_address,
            contents_id: this.slotData.postResult.id,
            image_width: 500,
            image_height: 500,
          },
        })
      }

      this.$emit('close')
    },
  },
}
</script>
<style lang="scss" scoped>
@import '../../../assets/scss/variables';

div {
  width: 100%;
  .text {
    font-family: $item-font;
    font-style: $item-font-style;
    font-weight: 700;
    font-size: 20px;
  }
  .inProgress {
    margin-bottom: 10px;
  }
  .spinner {
    display: none;

    &.active {
      display: inline-block;
      position: relative;
      width: 3px;
      margin: 0px auto;
      animation: rotation 0.6s infinite linear;
      border-left: 6px solid rgb(191, 191, 191);
      border-right: 6px solid rgb(191, 191, 191);
      border-bottom: 6px solid rgb(191, 191, 191);
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
  div {
    width: 100%;
  }

  & > span:nth-child(2) {
    align-self: center;
  }
}
</style>
