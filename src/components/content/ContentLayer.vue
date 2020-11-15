<template>
  <div>
    <div class="contentLayer" :class="{active: isLayerActive}" @click="onLayerClick()">
    </div>
    <transition name="slide-right">
      <div class="artistProfile" v-if="isLayerActive" :class="{active: isLayerActive}">
        <artist-profile :profileImage="image.profileImageUrl"></artist-profile>
      </div>
    </transition>
    <transition name="slide-left">
      <div class="actionList" v-if="isLayerActive" :class="{active: isLayerActive}">
        <action-list @handle-comment-click="handleCommentClick"></action-list>
      </div>
    </transition>
    <div class="comment" :class="{active: isCommentActive}">
      <div class="spinner" :class="{active: isSpinnerActive}"></div>
      <ul class="comment-list" :class="{active: isCommentListActive}">
        <li>user1: 훌륭한 작품이네요!</li>
        <li>user2: 잘봤습니다.</li>
        <li>user3: Good work</li>
      </ul>
    </div>
  </div>
</template>

<script>
import ArtistProfile from '../common/ArtistProfile'
import ActionList from '../common/ActionList'

export default {
  name: 'ContentLayer',
  components: {
    ArtistProfile, ActionList
  },
  props: {
    image: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      isLayerActive: false,
      isCommentActive: false,
      isSpinnerActive: true,
      isCommentListActive: false
    }
  },
  methods: {
    onLayerClick() {
      this.isLayerActive = !this.isLayerActive
      if (!this.isLayerActive) {
        this.handleCommentClick(false)
      }
    },
    handleCommentClick(isCommentActive) {
      this.isCommentActive = isCommentActive
      setTimeout(() => {
        this.isSpinnerActive = !isCommentActive
        this.isCommentListActive = isCommentActive
      }, 1000)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/variables';

.contentLayer {
  position: relative;
  height: 100%;
  width: 100%;
  border-radius: 20px;
  background-color: $artong-black;
  opacity: 0;
  cursor: pointer;
  &.active {
    opacity: .3;
  }
}

.comment {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  min-height: 57px;
  margin: 15px auto;
  background: $artong-white;
  box-shadow: 1px 1px .5em $lightgray;
  border-radius: 20px;

  &.active {
    display: block;
  }

  ul {
    text-align: left;
    display: none;

    &.active {
      display: block;
    }
  }

  .spinner {
    display: none;
    position: absolute;
    top: 9px;
    left: 45%;
    height: 30px;
    width: 30px;
    margin: 0px auto;
    animation: rotation .6s infinite linear;
    border-left: 6px solid rgba(0,174,239,.15);
    border-right: 6px solid rgba(0,174,239,.15);
    border-bottom: 6px solid rgba(0,174,239,.15);
    border-top: 6px solid rgba(0,174,239,.8);
    border-radius: 100%;

    &.active {
      display: block;
    }
  }

  @keyframes rotation {
    from {transform: rotate(0deg);}
    to {transform: rotate(359deg);}
  }
}

.slide-right-enter-active,
.slide-right-leave-active,
.slide-left-enter-active,
.slide-left-leave-active
{
    transition: transform 0.2s ease;
}

.slide-right-enter,
.slide-right-leave-to {
    transform: translateX(-10px);
    transition: all 100ms ease-in 0s;
}

.slide-left-enter,
.slide-left-leave-to {
    transform: translateX(10px);
    transition: all 100ms ease-in 0s;
}

.artistProfile {
  position: absolute;
  display: none;
  top: 10px;
  left: 10px;
  &.active {
    display: block;
  }
}

.actionList {
  position: absolute;
  display: none;
  background-color: $artong-white;
  line-height: 5px;
  padding: 5px;
  border-radius: 20px;
  width: 80px;
  bottom: 10px;
  right: 10px;
  &.active {
    display: block;
  }
}

</style>
