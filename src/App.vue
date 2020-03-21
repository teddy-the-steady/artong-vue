<template>
  <div id="app">
    <header-bar></header-bar>
    <side-bar></side-bar>
    <side-slide-bar></side-slide-bar>
    <div class="contents__body">
      <router-view/>
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
  text-align: center;
  color: #2c3e50;
  position: relative;
  overflow: hidden;
  min-height: 100%;
}

html {
  font-size: 16px;
}

body {
  margin: 0;
}

.contents__body {
  position: fixed;
  top: var(--head-height);
  width: 100vw;
  height: 100vh;
}

:root {
    --artong: #6610f2;
    --white: #ffffff;
    --lightslategray: gray;
    --lightgray: lightgray;
    --sidebar-backdrop: rgba(0,0,0,.5);

    --head-height: 50px;
}
</style>
