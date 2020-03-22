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
  color: var(--black);
  text-align: center;
  /* display: block;
  min-height: 100%;
  min-width: 320px;
  overflow-x: hidden;
  padding: 0 !important;
  margin: 0;
  line-height: 1.5em; */
}

html, body {
  font-size: 14px;
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
  min-height: 100vh;
  z-index: 10;
  padding-top: 50px;
}

.contents__body {
  position: relative;
  background: var(--aliceblue);
  padding-top: 1rem;
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
