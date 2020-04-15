<template>
  <transition name="slide">
    <nav class="sidebar" v-if="isBrowserPanelOpen">
      <div class="sidebar__items">
        <div></div>
        <div></div>
        <div></div>
      </div>
    </nav>
  </transition>
</template>

<script>
export default {
  name: 'SideBar',
  computed: {
    isBrowserPanelOpen () {
      return this.$store.state.isBrowserNavOpen
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

.sidebar {
  overflow-y: auto;
  background-color: var(--lightgray);
  position: fixed;
  left: 0;
  top: var(--head-height, 50px);
  height: 100%;
  z-index: 999;
  width: 60px;

  .sidebar__items {
    display: flex;
    flex-flow: column;
  }
}

@media screen and (max-width: 768px){
  .sidebar {
    display: none;
  }
}
</style>
