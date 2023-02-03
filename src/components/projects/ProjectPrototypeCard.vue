<template>
  <div class="wrapper" @click="backgroundClick()">
    <div class="background">
      <img ref="backgroundImage" />
    </div>
    <div class="top">
      <div class="profile" @click.stop="profileClick()">
        <img ref="projectProfileImage" />
      </div>
      <div class="symbol">{{ symbol.toUpperCase() }}</div>
    </div>
    <div class="name">{{ name }}</div>
    <div class="bottom">
      <ContentsProfileBundle class="bundle"></ContentsProfileBundle>
      <div class="contributors">@contributor +4</div>
    </div>
  </div>
</template>

<script>
import ContentsProfileBundle from '../profile/ContentsProfileBundle.vue'

export default {
  name: 'ProjectPrototypeCard',
  components: { ContentsProfileBundle },
  props: {
    name: {
      type: String,
      default: '',
    },
    symbol: {
      type: String,
      default: 'SYMBOL',
    },
    creating: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    backgroundClick() {
      if (this.creating) return
      this.$emit('project-background-click')
    },
    profileClick() {
      if (this.creating) return
      this.$emit('project-profile-click')
    },
  },
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/variables';

.wrapper {
  position: relative;
  border: 1px solid $lightgray;
  border-radius: 15px;
  margin: 24px 16px;
  background: linear-gradient(45deg, $darkgray, transparent);
  cursor: pointer;
  overflow: hidden;
  min-width: 340px;

  .background {
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    img {
      height: 120%;
      opacity: 0.5;
      filter: blur(3px);
    }
  }

  .top {
    display: flex;
    flex-direction: row;
    margin-top: 24px;
    position: relative;

    .profile {
      margin-left: 24px;
      cursor: pointer;
      display: inline-block;
      background-color: $lightergray;
      width: 100px;
      height: 100px;
      border-radius: 15px;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 15px;
        text-indent: -10000px;
      }
    }
    .symbol {
      position: absolute;
      right: 24px;
      width: 92px;
      height: 25px;

      border: 2px solid $profile-border-red;
      border-radius: 999px;

      font-family: $item-font;
      font-style: $item-font-style;
      font-weight: 800;
      font-size: 14px;
      line-height: 25px;
      color: $profile-border-red;

      overflow: hidden !important;
      text-overflow: ellipsis;
    }
  }
  .name {
    position: relative;
    margin-top: 213px;
    margin-left: 30px;
    font-family: 'Mustica Pro';
    font-style: normal;
    font-weight: 600;
    font-size: 32px;
    line-height: 44px;
    width: 300px;
    overflow: hidden !important;
    text-overflow: ellipsis;
  }
  .bottom {
    display: flex;
    margin: 16px 0;
    height: 32px;
    .bundle {
      margin-left: 35px;
    }
    .contributors {
      width: 150px;
      text-align: left;
      font-family: $item-font;
      font-style: $item-font-style;
      font-weight: 500;
      font-size: 14px;
      line-height: 32px;
      color: $artong-white;
    }
  }
}
</style>
