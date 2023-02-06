<template>
  <transition name="slide">
    <nav
      class="navbar"
      :class="{ active: isSideMenuOpen }"
      v-if="isHeadNavOpen"
    >
      <div class="navbar__side">
        <div class="navbar__menu">
          <Burger></Burger>
          <router-link
            to="/"
            class="logo-box"
            :class="{ active: isSideMenuOpen }"
          >
            <svg
              class="logo"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1690 300"
            >
              <g :class="{ active: isSideMenuOpen }" :style="randomDelayTime">
                <path
                  :class="{ active: isSideMenuOpen }"
                  d="M1614.9,90c41.48,0,75.1,33.62,75.1,75.1v-35.11c0-71.79-58.2-129.99-129.99-129.99h0c-6.8,0-13.49,.52-20.01,1.53-62.3,9.62-110,63.48-110,128.48v40c0,16.18,2.96,31.67,8.37,45.95,13.18,34.87,40.92,62.58,75.81,75.72,8.24,3.1,16.88,5.4,25.82,6.78,6.52,1.01,13.19,1.53,19.99,1.53h0c16.18,0,31.67-2.97,45.97-8.37,34.85-13.17,62.54-40.89,75.7-75.74,5.01-13.29,7.92-27.61,8.3-42.56-.89-29.6-25.14-53.33-54.96-53.33s-55,24.62-55,55v15c0,11.05-8.95,20-20,20s-20-8.95-20-20v-25.1c0-41.37,33.53-74.9,74.9-74.9Z"
                />
              </g>
              <g :class="{ active: isSideMenuOpen }" :style="randomDelayTime">
                <path
                  :class="{ active: isSideMenuOpen }"
                  d="M805,0h-189.84c-30.46,0-55.16,24.69-55.16,55.16h0c0,30.29,24.55,54.84,54.84,54.84h.34c1.77-26.64,17.43-49.47,39.81-61.32,10.46-5.54,22.38-8.68,35.04-8.68h0c39.73,0,72.22,30.92,74.78,70h-.06c-2.53-28.03-26.07-50-54.76-50h0c-28.69,0-52.24,21.97-54.76,50h-.24V244.84c0,30.46,24.69,55.16,55.16,55.16h0c30.29,0,54.84-24.55,54.84-54.84V110h40c30.38,0,55-24.62,55-55h0c0-30.38-24.62-55-55-55Z"
                />
              </g>
              <path
                :class="{ active: isSideMenuOpen }"
                d="M130.01,0h0c-6.8,0-13.49,.52-20.01,1.53C47.7,11.16,0,65.01,0,130.01v114.83c0,30.46,24.69,55.16,55.16,55.16h0c30.29,0,54.84-24.55,54.84-54.84v-80.26c0-41.37,33.53-74.9,74.9-74.9h0c41.48,0,75.1,33.62,75.1,75.1v-35.11C260,58.2,201.8,0,130.01,0Z"
              />
              <path
                :class="{ active: isSideMenuOpen }"
                d="M205,120h0c-30.38,0-55,24.62-55,55v69.84c0,30.46,24.69,55.16,55.16,55.16h0c30.29,0,54.84-24.55,54.84-54.84v-70.16c0-30.38-24.62-55-55-55Z"
              />
              <g :class="{ active: isSideMenuOpen }" :style="randomDelayTime">
                <path
                  :class="{ active: isSideMenuOpen }"
                  d="M1355,0h-75c-6.8,0-13.48,.53-20,1.53-62.3,9.62-110,63.48-110,128.48v114.83c0,30.46,24.69,55.16,55.16,55.16h0c30.29,0,54.84-24.55,54.84-54.84v-100.26c0-19.67,7.6-37.56,20-50.93,5.73-6.17,12.49-11.38,20-15.34,.13-.07,.26-.13,.4-.2,10.33-5.37,22.06-8.43,34.5-8.43h0c1.72,0,3.41,.08,5.1,.19,1.92,.13,3.82,.32,5.7,.59-25.93,4.38-45.68,26.92-45.7,54.1v.04h0v120c0,13.33,4.74,25.55,12.61,35.08,10.1,12.22,25.37,20,42.46,20h.16c17.05,0,32.27-7.79,42.31-20,7.78-9.46,12.45-21.56,12.45-34.76V55c0-30.38-24.62-55-55-55Z"
                />
              </g>
              <g :class="{ active: isSideMenuOpen }" :style="randomDelayTime">
                <path
                  :class="{ active: isSideMenuOpen }"
                  d="M1000,0h0c-71.8,0-130,58.2-130,130v40c0,71.8,58.2,130,130,130h0c71.8,0,130-58.2,130-130v-40c0-71.8-58.2-130-130-130Zm55,158.46c0,30.38-24.62,55-55,55h0c-30.38,0-55-24.62-55-55v-16.92c0-30.38,24.62-55,55-55h0c30.38,0,55,24.62,55,55v16.92Z"
                />
              </g>
              <g :class="{ active: isSideMenuOpen }" :style="randomDelayTime">
                <path
                  :class="{ active: isSideMenuOpen }"
                  d="M485,0h-150c-30.38,0-55,24.62-55,55V244.84c0,30.46,24.69,55.16,55.16,55.16h0c30.29,0,54.84-24.55,54.84-54.84v-100.26c0-19.67,7.6-37.56,20-50.93,5.73-6.17,12.49-11.38,20-15.34,10.42-5.5,22.29-8.63,34.9-8.63h0c1.72,0,3.41,.08,5.1,.19,1.92,.13,3.82,.32,5.7,.59-25.93,4.38-45.68,26.92-45.7,54.1v.04c0,30.42,24.66,55.08,55.08,55.08h.16c27.13,0,49.64-19.73,53.99-45.62,.41-2.47,.66-4.99,.73-7.56,.03,1.05,.04,2.11,.04,3.17V55c0-30.38-24.62-55-55-55Z"
                />
              </g>
              <g :class="{ active: isSideMenuOpen }" :style="randomDelayTime">
                <path
                  :class="{ active: isSideMenuOpen }"
                  d="M485.08,190h-.16c-17.94,0-33.86,8.6-43.89,21.9-6.93,9.19-11.04,20.62-11.04,33.02,0,13.33,4.74,25.55,12.61,35.08,10.1,12.22,25.37,20,42.46,20h.16c17.05,0,32.27-7.79,42.31-20,7.78-9.46,12.45-21.56,12.45-34.76v-.31c0-8.98-2.17-17.44-5.98-24.92-9.08-17.8-27.58-30-48.94-30Z"
                />
              </g>
            </svg>
          </router-link>
        </div>
      </div>
      <div class="navbar__side right">
        <div class="navbar__icons">
          <button
            v-if="innerWidth < 1080"
            class="round-button white-button ripple margin"
            @click="openSearchModalSignal = true"
          >
            <img src="../../assets/icons/search.svg" />
          </button>
          <div class="before_login" v-if="!currentUser.id">
            <router-link to="/login"> CONNECT </router-link>
          </div>
          <div class="after_login" v-else>
            <div v-if="innerWidth >= 1080" class="contribute">
              <button @click="contribute" v-ripple>Contribute</button>
            </div>
            <button
              v-else
              class="round-button white-button ripple margin"
              @click="contribute"
            >
              <img src="../../assets/icons/add.svg" />
            </button>
            <div
              class="header-profile"
              @mousedown="profileMouseDown"
              @mouseup="profileMouseUp"
            >
              <HeaderProfile></HeaderProfile>
            </div>
          </div>
        </div>
      </div>
      <SearchModal
        ref="searchModal"
        :openSearchModalSignal="openSearchModalSignal"
        @close-search-modal="openSearchModalSignal = false"
      >
      </SearchModal>
      <UserDialog
        class="dialog"
        :class="{ active: isDialogActive }"
        @dialog-focus-out="closeDialog"
        ref="dialog"
      >
        <div
          v-if="walletConnectState.chainId !== 1"
          slot="body"
          class="network"
          :style="{ background: 'orange', 'text-align': 'center' }"
        >
          WRONG NETWORK
        </div>
        <router-link
          slot="body"
          tag="div"
          :to="{
            name: 'UserOrArtist',
            params: {
              id: currentUser.username,
              wallet_address: currentUser.wallet_address,
            },
          }"
        >
          Profile
        </router-link>
        <div slot="body" @click="signOut">Disconnect</div>
      </UserDialog>
    </nav>
  </transition>
</template>

<script>
import { mapState } from 'vuex'
import Burger from './Burger.vue'
import HeaderProfile from '../profile/HeaderProfile.vue'
import UserDialog from '../dialog/UserDialog.vue'
import Ripple from '../../directives/ripple/Ripple'
import { isSessionValid } from '../../util/commonFunc'
import SearchModal from '../modal/SearchModal.vue'

export default {
  name: 'Header',
  components: {
    Burger,
    HeaderProfile,
    UserDialog,
    SearchModal,
  },
  data() {
    return {
      animationDelayTime: ['0.1s', '0.2s', '0.3s', '0.4s', '0.5s', '0.6s'],
      isDialogActive: false,
      isMouseDownOnProfile: false,
      isMouseUpOnProfile: false,
      openSearchModalSignal: false,
    }
  },
  computed: {
    ...mapState({
      isHeadNavOpen: state => state.menu.isHeadNavOpen,
      isSideMenuOpen: state => state.menu.isSideMenuOpen,
      currentUser: state => state.user.currentUser,
      innerWidth: state => state.menu.innerWidth,
      isModalOpen: state => state.menu.isModalOpen,
      walletConnectState: state => state.wallet,
    }),
    randomDelayTime() {
      return {
        '--animationDelayTime-1': this.animationDelayTime[0],
        '--animationDelayTime-2': this.animationDelayTime[1],
        '--animationDelayTime-3': this.animationDelayTime[2],
        '--animationDelayTime-4': this.animationDelayTime[3],
        '--animationDelayTime-5': this.animationDelayTime[4],
        '--animationDelayTime-6': this.animationDelayTime[5],
      }
    },
  },
  methods: {
    shuffleAnimationDelayTime() {
      this.animationDelayTime.sort(() => Math.random() - 0.5)
    },
    closeDialog() {
      this.isDialogActive = false
      this.isMouseDownOnProfile = false
      this.isMouseUpOnProfile = false
    },
    profileMouseDown() {
      this.isMouseDownOnProfile = true
    },
    profileMouseUp() {
      this.isMouseUpOnProfile = true
      if (this.isMouseDownOnProfile) {
        this.isDialogActive = true
      }
    },
    async signOut() {
      try {
        await this.$store.dispatch('AUTH_LOGOUT')
        this.$router.go(this.$router.currentRoute)
      } catch (error) {
        console.log(error)
      }
    },
    async contribute() {
      if (this.$router.currentRoute.name === 'Project') {
        if (!(await isSessionValid(this.$router.currentRoute.fullPath))) {
          return
        }
        this.$root.$emit('contribute')
      } else if (this.$router.currentRoute.name === 'Projects') {
        alert('First, choose a project to contribute!')
      } else {
        alert('First, choose a project to contribute!')
        this.$router.push({ name: 'Projects' })
      }
    },
  },
  watch: {
    isSideMenuOpen(val) {
      if (val) {
        this.shuffleAnimationDelayTime()
      }
    },
    isDialogActive(val) {
      if (val) {
        this.$nextTick(() => this.$refs.dialog.$el.focus())
      }
    },
    isModalOpen() {
      document.body.classList.toggle('prevent-scroll')
    },
  },
  directives: {
    ripple: Ripple,
  },
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/variables';

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.2s ease;
}

.slide-enter,
.slide-leave-to {
  transform: translateY(-100%);
  transition: all 150ms ease-in 0s;
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
  box-shadow: 1px 1px 4px 0 rgba(0, 0, 0, 0.15);

  .navbar__menu {
    display: flex;

    .logo-box {
      width: 100%;

      .logo {
        position: absolute;
        top: 23px;
        left: 49px;
        width: 130px;
        overflow: visible;

        path:nth-child(3) {
          &.active {
            display: none;
          }
        }

        path:nth-child(4) {
          &.active {
            display: none;
          }
        }

        path {
          &.active {
            animation: bounce 0.2s ease 7.5 alternate;
          }

          @keyframes bounce {
            100% {
              transform: translateY(-100px);
            }
          }
        }

        g {
          &.active {
            transform: translateX(-380px);
            transition: all 1.5s linear;
          }
        }

        g:nth-child(1) {
          &.active {
            transition-delay: var(--animationDelayTime-1);
          }
          path {
            &.active {
              animation-delay: var(--animationDelayTime-1);
            }
          }
        }

        g:nth-child(2) {
          &.active {
            transition-delay: var(--animationDelayTime-2);
          }
          path {
            &.active {
              animation-delay: var(--animationDelayTime-2);
            }
          }
        }

        g:nth-child(5) {
          &.active {
            transition-delay: var(--animationDelayTime-3);
          }
          path {
            &.active {
              animation-delay: var(--animationDelayTime-3);
            }
          }
        }

        g:nth-child(6) {
          &.active {
            transition-delay: var(--animationDelayTime-4);
          }
          path {
            &.active {
              animation-delay: var(--animationDelayTime-4);
            }
          }
        }

        g:nth-child(7) {
          &.active {
            transition-delay: var(--animationDelayTime-5);
          }
          path {
            &.active {
              animation-delay: var(--animationDelayTime-5);
            }
          }
        }

        g:nth-child(8) {
          &.active {
            transition-delay: var(--animationDelayTime-6);
          }
          path {
            &.active {
              animation-delay: var(--animationDelayTime-6);
            }
          }
        }
      }
    }
  }

  .navbar__side {
    padding: 0 12px;
    width: 25%;

    .navbar__icons {
      align-items: center;
      position: absolute;
      right: 10px;
      top: 10px;
      .margin {
        margin-right: 10px;
      }
      .before_login {
        height: 2rem;
        border-radius: 2rem;
        width: 90px;
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
        width: 48px;
        height: 48px;
        border-radius: 50%;
        box-shadow: 1px 1px 4px 0 rgba(0, 0, 0, 0.15);
        cursor: pointer;
      }
    }

    .after_login {
      display: flex;
      align-items: center;

      .contribute {
        margin-right: 10px;
        border-radius: 2rem;
        cursor: pointer;

        a {
          font-weight: 800;
          font-size: 1.1rem;
          color: $artong-white;
          text-decoration: none;
          vertical-align: -webkit-baseline-middle;
        }
      }
      .contribute-round {
        width: 30px;
        height: 30px;
        background: #ffffff;
        border: 1px solid #f2f2f2;
        box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.08);
        border-radius: 999px;
        line-height: 30px;
        margin-right: 8px;
        img {
          vertical-align: middle;
        }
      }
    }
  }

  .right {
    .navbar__icons {
      display: flex;
      float: right;
    }
  }

  .dialog {
    display: none;
    &.active {
      display: block;
    }
  }
}

@media only screen and (max-width: 599px) {
  .navbar {
    background-color: transparent;
    box-shadow: none;
    &.active {
      background-color: $artong-white;
    }
    .navbar__side {
      .navbar__icons {
        .before_login {
          width: 70px;
          a {
            font-size: 0.8rem;
          }
        }
      }
    }
  }
}

@media only screen and (max-width: 1080px) {
  .navbar {
    background-color: transparent;
    box-shadow: none;
    &.active {
      background-color: $artong-white;
    }
  }
}
@media only screen and (min-width: 1080px) {
  .before_login {
    position: relative;
    top: 10px;
  }
}
</style>
