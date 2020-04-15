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
    z-index: 1000;
    box-shadow: 1px 1px 4px 0 rgba(0,0,0,.15);

    .navbar__logo {
        font-size: 24px;
        
        a {
            color: $artong-black;
        }
    }

    .navbar__side {
        padding: 0 12px;

        .navbar__icons {
            list-style: none;
            padding-left: 0;

            .profile {
                background-color: $artong-white;
                width: 30px;
                height: 30px;
                border: 2px solid $artong-main;
                border-radius: 50%;

                img {
                    width: 30px;
                    vertical-align: center;
                }
            }
        }
    }
}
</style>
