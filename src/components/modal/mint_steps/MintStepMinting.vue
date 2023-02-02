<template>
  <div>
    <div class="text inProgress" v-if="!finishedUploading">
      Uploading to IPFS
    </div>
    <div
      class="text inProgress"
      v-else-if="finishedUploading && !finishedMinting"
    >
      Minting
    </div>
    <div class="text" v-else-if="finishedMinting">Completed!</div>
    <div>
      <div
        class="spinner"
        :class="{
          active: !finishedUploading || !finishedMinting,
        }"
      ></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MintStepMinting',
  props: {
    finishedUploading: {
      type: Boolean,
      default: false,
    },
    finishedMinting: {
      type: Boolean,
      default: false,
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
