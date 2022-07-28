<template>
  <transition name="slide">
    <nav class="navbar" v-if="isHeadNavOpen">
      <div class="navbar__side left">
        <div class="navbar__menu">
          <burger></burger>
          <router-link to="/" class="logo" :class="{active: isSideMenuOpen}">
            <b>
              <span :class="{active: isSideMenuOpen}">4</span>
              <span :class="{active: isSideMenuOpen}" :style="animationDelayTime">r</span>
              <span :class="{active: isSideMenuOpen}" :style="animationDelayTime">t</span>
              <span :class="{active: isSideMenuOpen}" :style="animationDelayTime">o</span>
              <span :class="{active: isSideMenuOpen}" :style="animationDelayTime">n</span>
              <span :class="{active: isSideMenuOpen}" :style="animationDelayTime">g</span>
            </b>
          </router-link>
        </div>
      </div>
      <!-- <div class="navbar__logo">
      </div> -->
      <div class="navbar__side right">
        <div class="navbar__icons">
          <div class="login" v-if="!currentUser.id">
            <router-link to="/login">
              SIGN IN
            </router-link>
          </div>
          <div class="header-profile" v-else>
            <router-link :to="{ name: 'UserOrArtist', params: { id: currentUser.username }}">
              <header-profile></header-profile>
            </router-link>
          </div>
        </div>
      </div>
    </nav>
  </transition>
</template>

<script>
import Burger from './Burger'
import HeaderProfile from '../profile/HeaderProfile'
import { mapState } from 'vuex'
export default {
  name: 'Header',
  components: {
    Burger,
    HeaderProfile
  },
  data() {
    return {
      animationDelayTime1: '0.1s',
      animationDelayTime2: '0.2s',
      animationDelayTime3: '0.3s',
      animationDelayTime4: '0.4s',
      animationDelayTime5: '0.5s'
    }
  },
  computed: {
    ...mapState({
      isHeadNavOpen: state => state.menu.isHeadNavOpen,
      isSideMenuOpen: state => state.menu.isSideMenuOpen,
      currentUser: state => state.user.currentUser
    }),
    animationDelayTime() {
      return {
        "--animationDelayTime1": this.animationDelayTime1,
        "--animationDelayTime2": this.animationDelayTime2,
        "--animationDelayTime3": this.animationDelayTime3,
        "--animationDelayTime4": this.animationDelayTime4,
        "--animationDelayTime5": this.animationDelayTime5
      }
    }
  },
  methods: {
    shuffleAnimationDelayTime() {
      const times = ['0.1s', '0.2s', '0.3s', '0.4s', '0.5s']
      times.sort(() => Math.random() - 0.5)
      this.animationDelayTime1 = times[0]
      this.animationDelayTime2 = times[1]
      this.animationDelayTime3 = times[2]
      this.animationDelayTime4 = times[3]
      this.animationDelayTime5 = times[4]
    }
  },
  watch: {
    isSideMenuOpen(val) {
      if (val) {
        this.shuffleAnimationDelayTime()
      }
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

  .navbar__menu {
    display: flex;

    .logo {
      position: absolute;
      left: 45px;
      width: 80px;
      font-size: 24px;

      span:nth-child(1) {
        &.active {
          color: transparent;
        }
      }

      span:nth-child(n+2) {
        &.active {
          position: relative;
          top: 0px;
          display: inline-block;
          animation: bounce .2s ease 7.5 alternate;
          transform: translateX(-25px);
          transition: all 1.5s ease-in;
        }
      }

      span:nth-child(2) {
        &.active {
          animation-delay: var(--animationDelayTime1);
          transition-delay: var(--animationDelayTime1);
        }
      }

      span:nth-child(3) {
        &.active {
          animation-delay: var(--animationDelayTime2);
          transition-delay: var(--animationDelayTime2);
        }
      }

      span:nth-child(4) {
        &.active {
          animation-delay: var(--animationDelayTime3);
          transition-delay: var(--animationDelayTime3);
        }
      }

      span:nth-child(5) {
        &.active {
          animation-delay: var(--animationDelayTime4);
          transition-delay: var(--animationDelayTime4);
        }
      }

      span:nth-child(6) {
        &.active {
          animation-delay: var(--animationDelayTime5);
          transition-delay: var(--animationDelayTime5);
        }
      }

      @keyframes bounce {
        100% {
          top: -10px;
        }
      }
    }
  }

  .navbar__side {
    padding: 0 12px;
    width: 25%;

    .navbar__icons {
      .login {
        height: 2rem;
        border-radius: 2rem;
        width: 80px;
        background-color: $artong-black;

        a {
          font-weight: 800;
          font-size: 1.1rem;
          color: $artong-white;
          text-decoration: none;
          vertical-align: -webkit-baseline-middle;
        }
      }

      .header-profile {
        display: block;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        box-shadow: 1px 1px 4px 0 rgba(0,0,0,.15);
      }
    }
  }

  .right {
    .navbar__icons {
      float: right;
    }
  }
}

@media only screen and (max-width: 599px) {
  .navbar {
    .navbar__side {
      .navbar__icons {
        .login {
          width: 60px;
          a {
            font-size: .8rem;
          }
        }
      }
    }
  }
}
</style>
