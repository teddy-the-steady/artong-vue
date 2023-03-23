<template>
  <nav class="sidebar">
    <transition name="backdrop">
      <div
        class="sidebar-backdrop"
        @click="closeSidebarPanel"
        v-if="isSideMenuOpen"
      ></div>
    </transition>
    <transition name="slide">
      <div class="sidebar-panel" v-show="isSideMenuOpen">
        <SidebarMenu
          :menu="menu"
          :theme="theme"
          :show-one-child="true"
          @item-click="onItemClick"
        />
      </div>
    </transition>
  </nav>
</template>

<script>
import { mapState } from 'vuex'
import { menuItems } from './menuItems'
import SidebarMenu from './SidebarMenu.vue'

export default {
  name: 'Sidebar',
  components: {
    SidebarMenu,
  },
  props: {
    theme: {
      type: String,
      default: '',
    },
  },
  computed: {
    ...mapState({
      isSideMenuOpen: state => state.menu.isSideMenuOpen,
    }),
    menu() {
      return menuItems()
    },
  },
  methods: {
    closeSidebarPanel() {
      this.$store.commit('TOGGLE_NAV')
    },
    onItemClick() {
      this.$store.commit('SET_SIDE_MENU_FALSE')
    },
  },
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/variables';

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.2s ease;
}

.slide-enter,
.slide-leave-to {
  transform: translateX(-100%);
  transition: all 150ms ease-in 0s;
}

.backdrop-enter-active,
.backdrop-leave-active {
  transition: opacity 0.3s;
}

.backdrop-enter,
.backdrop-leave-to {
  opacity: 0;
}

.sidebar-backdrop {
  background-color: $backdrop;
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  cursor: pointer;
  z-index: 997;
}

.sidebar-panel {
  overflow-y: auto;
  background-color: $artong-white;
  position: fixed;
  left: 0;
  top: $head-height;
  height: 100%;
  z-index: 997;
  width: 300px;
}
</style>
