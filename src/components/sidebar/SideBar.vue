<template>
    <nav class="sidebar">
        <transition name="backdrop">
            <div class="sidebar-backdrop" @click="closeSidebarPanel" v-if="isSideMenuOpen"></div>
        </transition>
        <transition name="slide">
            <div class="sidebar-panel" v-if="isSideMenuOpen">
                <sidebar-menu
                    :menu="menu"
                    :theme="selectedTheme"
                    :show-one-child="true"
                    @item-click="onItemClick"
                />
            </div>
        </transition>
    </nav>
</template>

<script>
import { mapState } from 'vuex'
import menuItems from './menuItems'
import SidebarMenu from './SidebarMenu.vue'

export default {
  name: 'Sidebar',
  components: {
    SidebarMenu
  },
  data() {
    return {
      menu: menuItems
    }
  },
  computed: {
    ...mapState({
      isSideMenuOpen: state => state.menu.isSideMenuOpen,
      selectedTheme: state => state.menu.isDark? 'default-theme' : 'white-theme'
    })
  },
  methods: {
    closeSidebarPanel() {
      this.$store.commit('TOGGLE_NAV')
    },
    onItemClick(event, item) {
      console.log('onItemClick')
      console.log(event)
      console.log(item)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/variables';

.slide-enter-active,
.slide-leave-active{
    transition: transform 0.2s ease;
}

.slide-enter,
.slide-leave-to {
    transform: translateX(-100%);
    transition: all 150ms ease-in 0s
}

.backdrop-enter-active,
.backdrop-leave-active{
    transition: opacity .3s;
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
    z-index: 998;
}

.sidebar-panel {
    overflow-y: auto;
    background-color: $artong-white;
    position: fixed;
    left: 0;
    top: $head-height;
    height: 100%;
    z-index: 999;
    width: 300px;
}
</style>
