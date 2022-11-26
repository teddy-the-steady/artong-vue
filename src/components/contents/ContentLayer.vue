<template>
  <div>
    <div
      class="layer"
      :class="{ active: isLayerActive }"
      @click="onLayerClick()"
    ></div>
    <transition name="slide-right">
      <div
        class="inContentsProfile"
        v-if="isLayerActive"
        :class="{ active: isLayerActive }"
      >
        <router-link
          :to="{ name: 'UserOrArtist', params: { id: image.username } }"
        >
          <in-contents-profile
            :profileImageUrl="image.profileImageUrl"
          ></in-contents-profile>
        </router-link>
      </div>
    </transition>
    <transition name="slide-left">
      <div
        class="reactionList"
        v-if="isLayerActive"
        :class="{ active: isLayerActive }"
      >
        <reaction-list
          :isPropCommentActive="isPropCommentActive"
          :image="image"
          @handle-comment-click="handleCommentClick"
        >
        </reaction-list>
      </div>
    </transition>
  </div>
</template>

<script>
import InContentsProfile from '../profile/InContentsProfile.vue'
import ReactionList from '../contents/ReactionList.vue'

export default {
  name: 'ContentLayer',
  components: {
    InContentsProfile,
    ReactionList,
  },
  props: {
    image: {
      type: Object,
      default: null,
    },
    isPropCommentActive: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isLayerActive: false,
    }
  },
  methods: {
    onLayerClick() {
      this.isLayerActive = !this.isLayerActive
    },
    handleCommentClick(isActive) {
      this.$emit('handle-comment-click', isActive)
    },
  },
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
    opacity: 0.3;
  }
}

.slide-right-enter-active,
.slide-right-leave-active,
.slide-left-enter-active,
.slide-left-leave-active {
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

.reactionList {
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
