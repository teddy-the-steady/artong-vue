<template>
  <div id="app">
    <header-bar id="header-bar"></header-bar>
    <side-bar id="side-bar"></side-bar>
    <div class="contents">
      <keep-alive>
        <router-view class="contents__body"/>
      </keep-alive>
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
  },
  computed: {
    isBurgerActive() {
      return this.$store.state.isNavOpen
    }
  },
  watch: {
    isBurgerActive() {
      document.body.classList.toggle('prevent-scroll')
    }
  }
}
</script>

<style lang="scss">
@import './assets/scss/variables';

html {
    font-size: 14px;
    height: 100%;

    .prevent-scroll {
      overflow: hidden;
    }

    body {
        margin: 0;
        height: 100%;
        background: $artong-main;
        overflow-y: scroll;

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

            #header-bar {
              z-index: 2020;
            }

            #side-bar {
              z-index: 2030;
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
