<template>
  <transition name="slide">
    <nav class="navbar" v-if="isHeadNavOpen">
      <div class="navbar__side left">
        <div class="navbar__menu">
          <burger></burger>
        </div>
      </div>
      <div class="navbar__logo">
        <router-link to="/"><b><i>4</i>rtong</b></router-link>
      </div>
      <div class="navbar__side right">
        <div class="navbar__icons">
          <div class="login" v-if="!currentUser.id">
            <router-link to="/login">
              SIGN IN
            </router-link>
          </div>
          <div class="profile" v-else>
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
  computed: {
    ...mapState({
      isHeadNavOpen: state => state.menu.isHeadNavOpen,
      currentUser: state => state.user.currentUser
    })
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
    width: 20%;

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

      .profile {
        width: 30px;
        height: 30px;
        border-radius: 2rem;
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
