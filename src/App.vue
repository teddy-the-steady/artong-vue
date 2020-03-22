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
  text-align: center;
  display: block;
  min-height: 100%;
  min-width: 320px;
  overflow-x: hidden;
  padding: 0 !important;
  margin: 0;
  line-height: 1.5em;
}

html, body {
  font-size: 14px;
  height: 100%;
}

body {
  margin: 0;
  overflow-x: hidden;
  background: #2c3e50 !important;
}

.contents {
  background: var(--white);
  position: relative;
  overflow: hidden;
  min-height: 100vh;
  z-index: 10;
  padding-top: 50px;
}

.contents__body {
  position: relative;
  background: var(--aliceblue)
}

:root {
    --artong: #6610f2;
    --white: #ffffff;
    --lightslategray: gray;
    --lightgray: lightgray;
    --aliceblue: aliceblue;
    --sidebar-backdrop: rgba(0,0,0,.5);

    --head-height: 50px;
}
</style>
