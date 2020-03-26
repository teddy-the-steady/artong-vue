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

html, body {
  font-size: 14px;
  height: 100%;
}

body {
  margin: 0;
  height: 100%;
  background: #2c3e50 !important;
}

.contents {
  background: var(--white);
  position: relative;
  overflow: hidden;
  min-height: 100%;
  z-index: 10;
}

.contents__body {
  position: relative;
  background: var(--aliceblue);
  padding-top: 60px;
  height: 100%;
}

:root {
    --artong: #6610f2;
    --white: #ffffff;
    --black: black;
    --lightslategray: gray;
    --lightgray: lightgray;
    --aliceblue: aliceblue;
    --sidebar-backdrop: rgba(0,0,0,.5);

    --head-height: 50px;
}
</style>
