<template>
  <div>
    <div class="contentLayer" v-bind:class="{active: isActive}" @click="onLayerClick()">
    </div>
    <transition name="slide-right">
      <div class="artistProfile" v-if="isActive" v-bind:class="{active: isActive}">
        <artist-profile :profileImage="image.profileImageUrl"></artist-profile>
      </div>
    </transition>
    <transition name="slide-left">
      <div class="actionList" v-if="isActive" v-bind:class="{active: isActive}">
        <action-list></action-list>
      </div>
    </transition>
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
      isActive: false
    }
  },
  methods: {
    onLayerClick() {
      this.isActive = !this.isActive
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/variables';

.contentLayer {
  position: absolute;
  top: 0;
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
    transition: all 100ms ease-in 0s
}

.slide-left-enter,
.slide-left-leave-to {
    transform: translateX(10px);
    transition: all 100ms ease-in 0s
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
