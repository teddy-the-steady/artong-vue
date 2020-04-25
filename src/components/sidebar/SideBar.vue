<template>
    <nav class="sidebar">
        <div class="sidebar-backdrop" @click="closeSidebarPanel" v-if="isPanelOpen"></div>
        <transition name="slide">
            <div v-if="isPanelOpen" class="sidebar-panel">
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
import menuItems from './menuItems'
import SidebarMenu from './SidebarMenu'
export default {
  name: 'Sidebar',
  components: {
      SidebarMenu
  },
  data () {
    return {
      menu: menuItems,
      selectedTheme: 'white-theme'
    }
  },
  computed: {
    isPanelOpen () {
      return this.$store.state.isNavOpen
    }
  },
  methods: {
    closeSidebarPanel () {
      this.$store.commit('toggleNav')
    },
    onItemClick (event, item) {
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
.slide-leave-active
{
    transition: transform 0.2s ease;
}

.slide-enter,
.slide-leave-to {
    transform: translateX(-100%);
    transition: all 150ms ease-in 0s
}

.sidebar-backdrop {
    background-color: $sidebar-backdrop;
    width: 100%;
    height: 100%;
    position: fixed;
    top: $head-height;
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
