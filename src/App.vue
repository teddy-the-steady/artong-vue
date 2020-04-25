<template>
  <div id="app">
    <side-bar></side-bar>
    <header-bar></header-bar>
    <div class="contents">
      <router-view class="contents__body"/>
    </div>
  </div>
</template>

<script>
import HeaderBar from './components/header/Header'
import SideBar from './components/sidebar/SideBar'
export default {
  name: 'App',
  components: {
    HeaderBar,
    SideBar
  }
}
</script>

<style lang="scss">
@import './assets/scss/variables';

html {
    font-size: 14px;
    height: 100%;

    body {
        margin: 0;
        height: 100%;
        background: $artong-main;

        a {
            color: $artong-main;
            text-decoration: none;
        }

        button {
            font-size: 12px;
            touch-action: manipulation;
            cursor: pointer;
            color: $artong-white;
            background-color: $artong-main;
            text-transform: uppercase;
            padding: 14px 0;
            letter-spacing: 1.1px;
            border: none;
        }

        #app {
            font-family: 'Avenir', Helvetica, Arial, sans-serif;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            background: $aliceblue;
            color: $artong-black;
            text-align: center;
            height: 100%;
            min-height: 100%;

            .contents {
                background: $artong-white;
                position: relative;
                overflow: hidden;
                min-height: 100%;
                z-index: 10;
            }
        }

        /* #app 안에 넣으면 다른 template들 덮어쓰는 문제 */
        .contents__body {
            position: relative;
            background: $aliceblue;
            padding-top: 60px;
            height: 100%;
        }
    }
}
</style>
