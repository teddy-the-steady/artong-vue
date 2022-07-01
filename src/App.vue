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
import { mapState } from 'vuex'
import { getMember } from './api/member'

export default {
  name: 'App',
  components: {
    HeaderBar,
    SideBar
  },
  computed: {
    ...mapState({
      isSideMenuOpen: state => state.menu.isSideMenuOpen,
      isModalOpen: state => state.menu.isModalOpen,
      authError: state => state.auth.status
    })
  },
  async created() {
    try {
      const currentSession = await this.$store.dispatch('AUTH_CHECK_CURRENT_SESSION')
      const member = await getMember(currentSession.getAccessToken().payload.username)
      await this.$store.dispatch('CURRENT_USER', member)
    } catch (error) {
      if (this.authError === 'error') {
        await this.$store.dispatch('AUTH_LOGOUT')
      } else if (error === 'No current user') {
        console.log('No current user')
      }
    }
  },
  watch: {
    isSideMenuOpen() {
      document.body.classList.toggle('prevent-scroll')
    },
    isModalOpen() {
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
            background: $artong-white;
            color: $artong-main;
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
            background: $artong-white;
            height: 100%;
            padding-top: 55px;
        }
    }
}
</style>
