<template>
  <div id="app">
    <header-bar></header-bar>
    <side-bar></side-bar>
    <side-slide-bar></side-slide-bar>
    <router-view/>
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
    SideSlideBar,
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
}

html {
  font-size: 16px;
}

body {
  margin: 0;
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
