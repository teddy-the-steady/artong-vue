<template>
  <div id="app">
    <side-bar></side-bar>
    <side-slide-bar></side-slide-bar>
    <header-bar></header-bar>
    <div class="contents">
      <router-view class="contents__body"/>
    </div>
  </div>
</template>

<script>
import HeaderBar from './components/header/Header.vue'
import SideBar from './components/sidebar/SideBar.vue'
import SideSlideBar from './components/sidebar/SideSlideBar.vue'
export default {
  name: 'App',
  components: {
    HeaderBar,
    SideBar,
    SideSlideBar
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: var(--aliceblue);
  color: var(--black);
  text-align: center;
  height: 100%;
  min-height: 100%;
}
</style>
