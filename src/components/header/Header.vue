<template>
  <transition name="slide">
    <nav class="navbar" v-if="isBrowserPanelOpen">
      <div class="navbar__side">
        <div class="navbar__menu">
          <burger></burger>
        </div>
      </div>
      <div class="navbar__logo">
        <a href="."><b><i>A</i>rtong</b></a>
      </div>
      <div class="navbar__side" @click="scrollToTop">
        <div class="navbar__icons">
          <header-profile></header-profile>
        </div>
      </div>
    </nav>
  </transition>
</template>

<script>
import Burger from './Burger'
import HeaderProfile from '../profile/HeaderProfile'

export default {
  name: 'Header',
  components: {
    Burger,
    HeaderProfile
  },
  computed: {
    isBrowserPanelOpen() {
      return this.$store.state.isHeadNavOpen
    }
  },
  methods: {
    scrollToTop() {
      window.scrollTo({top: 0})
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/variables';

.slide-enter-active,
.slide-leave-active
{
    transition: transform 0.2s ease;
}

.slide-enter,
.slide-leave-to {
    transform: translateY(-100%);
    transition: all 150ms ease-in 0s
}

.navbar {
    display: flex;
    position: fixed;
    top: 0;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    background-color: $artong-white;
    height: $head-height;
    box-shadow: 1px 1px 4px 0 rgba(0,0,0,.15);

    .navbar__logo {
        font-size: 24px;

        a {
            color: $artong-black;
            text-decoration: none;
        }
    }

    .navbar__side {
        padding: 0 12px;

        .navbar__icons {
            list-style: none;
            padding-left: 0;
        }
    }
}
</style>
