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
      <div class="navbar__side">
        <ul class="navbar__icons">
          <li class="profile">
            <router-link to="/login">
              <img src="../../assets/images/profilethumb.png" alt="">
            </router-link>
          </li>
        </ul>
      </div>
    </nav>
  </transition>
</template>

<script>
import Burger from './Burger'

export default {
  name: 'Header',
  components: {
    Burger
  },
  computed: {
    isBrowserPanelOpen () {
      return this.$store.state.isBrowserNavOpen
    }
  },
  methods: {

  }
}
</script>

<style scoped>
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

a {
    color: var(--white);
}

.navbar {
    display: flex;
    position: fixed;
    top: 0;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    background-color: var(--artong);
    height: var(--head-height);
    z-index: 1000;
}
.navbar__side {
  padding: 0 12px;
}
.navbar__logo {
    font-size: 24px;
}

.navbar__icons {
    list-style: none;
    padding-left: 0;
}

.profile {
    background-color: var(--white);
    width: 30px;
    height: 30px;
    border: 2px solid var(--white);
    border-radius: 50%
}
.profile img {
    width: 30px;
    vertical-align: center;
}
</style>
