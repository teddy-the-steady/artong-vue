<template>
    <nav class="sidebar">
        <div class="sidebar-backdrop" @click="closeSidebarPanel" v-if="isPanelOpen"></div>
        <transition name="slide">
            <div v-if="isPanelOpen"
                 class="sidebar-panel">
                <ul class="sidebar-panel-nav">
                    <li @click="closeSidebarPanel"><router-link to="/">Home</router-link></li>
                    <li @click="closeSidebarPanel"><router-link to="/server">Server</router-link></li>
                    <li><a href="#trend">Trending</a></li>
                    <li><a href="#follow">Following</a></li>
                </ul>
            </div>
        </transition>
    </nav>
</template>

<script>
export default {
  name: 'SideSlideBar',
  computed: {
    isPanelOpen () {
      return this.$store.state.isNavOpen
    }
  },
  methods: {
    closeSidebarPanel () {
      this.$store.commit('toggleNav')
    }
  }
}
</script>

<style>
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
    background-color: var(--sidebar-backdrop);
    width: 100%;
    height: 100%;
    position: fixed;
    top: var(--head-height, 50px);
    left: 0;
    cursor: pointer;
    z-index: 998;
}

.sidebar-panel {
    overflow-y: auto;
    background-color: var(--white);
    position: fixed;
    left: 0;
    top: var(--head-height, 50px);
    height: 100%;
    z-index: 999;
    padding: 3rem 20px 2rem 20px;
    width: 200px;
}

ul.sidebar-panel-nav {
    list-style-type: none;
    text-align: left;
}

ul.sidebar-panel-nav > li > a {
    color: var(--artong);
    text-decoration: none;
    font-size: 1.5rem;
    display: block;
    padding-bottom: 0.5em;
}
</style>
