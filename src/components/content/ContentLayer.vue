<template>
  <div>
    <div class="layer" :class="{active: isLayerActive}" @click="onLayerClick()">
    </div>
    <transition name="slide-right">
      <div class="inContentsProfile" v-if="isLayerActive" :class="{active: isLayerActive}">
        <in-contents-profile :profileImage="image.profileImageUrl"></in-contents-profile>
      </div>
    </transition>
    <transition name="slide-left">
      <div class="actionList" v-if="isLayerActive" :class="{active: isLayerActive}">
        <action-list :isPropCommentActive="isPropCommentActive" @handle-comment-click="handleCommentClick"></action-list>
      </div>
    </transition>
  </div>
</template>

<script>
import InContentsProfile from '../profile/InContentsProfile'
import ActionList from '../content/ActionList'

export default {
  name: 'ContentLayer',
  components: {
    InContentsProfile, ActionList
  },
  props: {
    image: {
      type: Object,
      default: null
    },
    isPropCommentActive: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isLayerActive: false
    }
  },
  methods: {
    onLayerClick() {
      this.isLayerActive = !this.isLayerActive
    },
    handleCommentClick(isActive) {
      this.$emit('handle-comment-click', isActive)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/variables';

.layer {
  position: absolute;
  height: 100%;
  width: 100%;
  border-radius: 20px;
  background-color: $artong-black;
  opacity: 0;
  cursor: pointer;
  user-select: none;
  &.active {
    opacity: .3;
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

.inContentsProfile {
  display: none;
  &.active {
    display: block;
    position: absolute;
    top: 10px;
    left: 10px;
  }
}

.actionList {
  display: none;
  &.active {
    display: block;
    position: absolute;
    background-color: $artong-white;
    line-height: 5px;
    padding: 5px;
    border-radius: 20px;
    width: 80px;
    bottom: 10px;
    right: 10px;
  }
}

</style>
