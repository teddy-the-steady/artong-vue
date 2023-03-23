<template>
  <div :class="{ active: isSideMenuOpen }" id="burger" @click.prevent="toggle">
    <slot>
      <button class="burger-button" title="Menu">
        <span class="burger-bar burger-bar__1"></span>
        <span class="burger-bar burger-bar__2"></span>
        <span class="burger-bar burger-bar__3"></span>
      </button>
    </slot>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'Burger',
  computed: {
    ...mapState({
      isSideMenuOpen: state => state.menu.isSideMenuOpen,
    }),
  },
  methods: {
    toggle() {
      this.$store.commit('TOGGLE_NAV')
    },
  },
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/variables';

#burger {
  z-index: 2030;
  &.active {
    .burger-button {
      transform: rotate(-180deg);

      .burger-bar__1 {
        transform: translateX(-3px) rotate(90deg) scaleY(1.5);
      }

      .burger-bar__2 {
        transform: translateX(-2px) translateY(-3px) scaleX(0.8);
      }

      .burger-bar__3 {
        transform: scaleY(1.4) translateX(5px) rotate(-42deg);
      }
    }
  }

  .burger-button {
    cursor: pointer;
    position: relative;
    height: 30px;
    width: 32px;
    display: block;
    border: 0;
    border-radius: 0;
    background-color: transparent;
    pointer-events: all;
    transition: transform 0.6s cubic-bezier(0.165, 0.84, 0.44, 1);

    /* remove blue outline */
    &:focus {
      outline: 0;
    }

    .burger-bar {
      position: absolute;
      border-radius: 1px;
      top: 50%;
      right: 6px;
      left: 6px;
      height: 2px;
      width: auto;
      margin-top: -1px;
      transition: transform 0.6s cubic-bezier(0.165, 0.84, 0.44, 1),
        opacity 0.3s cubic-bezier(0.165, 0.84, 0.44, 1),
        background-color 0.6s cubic-bezier(0.165, 0.84, 0.44, 1);
      box-shadow: 1px 1px 3px rgb(255 255 255 / 50%);
    }

    .burger-bar__1 {
      -webkit-transform: translateY(-6px);
      transform: translateY(-6px);
    }

    .burger-bar__2 {
      transform-origin: 100% 50%;
      transform: scaleX(0.8);
    }

    .burger-bar__3 {
      transform: translateY(6px);
    }
  }
}
</style>
