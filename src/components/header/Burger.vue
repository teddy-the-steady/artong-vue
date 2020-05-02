<template>
    <div id="burger"
         :class="{ 'active' : isBurgerActive }"
         @click.prevent="toggle">
        <slot>
            <button type="button" class="burger-button" title="Menu">
                <span class="burger-bar burger-bar__1"></span>
                <span class="burger-bar burger-bar__2"></span>
                <span class="burger-bar burger-bar__3"></span>
            </button>
        </slot>
    </div>
</template>

<script>
export default {
  name: 'Burger',
  computed: {
    isBurgerActive () {
      return this.$store.state.isNavOpen
    }
  },
  methods: {
    toggle () {
      this.$store.commit('toggleNav')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/variables';

#burger {
    &.active {
        .burger-button {
            transform: rotate(-180deg);

            .burger-bar {
                background-color: $artong-black;
            }
            .burger-bar__1 {
                transform: rotate(45deg)
            }

            .burger-bar__2 {
                opacity: 0;
            }

            .burger-bar__3 {
                transform: rotate(-45deg)
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
        transition: transform .6s cubic-bezier(.165,.84,.44,1);

        /* remove blue outline */
        &:focus {
            outline: 0;
        }

        .burger-bar {
            background-color: $artong-black;
            position: absolute;
            top: 50%;
            right: 6px;
            left: 6px;
            height: 2px;
            width: auto;
            margin-top: -1px;
            transition: transform .6s cubic-bezier(.165,.84,.44,1),opacity .3s cubic-bezier(.165,.84,.44,1),background-color .6s cubic-bezier(.165,.84,.44,1);
        }

        .burger-bar__1 {
            -webkit-transform: translateY(-6px);
            transform: translateY(-6px);
        }

        .burger-bar__2 {
            transform-origin: 100% 50%;
            transform: scaleX(.8);
        }

        &:hover .burger-bar__2 {
            transform: scaleX(1);
        }

        .burger-bar__3 {
            transform: translateY(6px);
        }
    }
}
</style>
