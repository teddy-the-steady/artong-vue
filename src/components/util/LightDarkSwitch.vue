<template>
  <div class="wrapper">
    <input type="checkbox" id="switch" v-model="isDark" @change="toggle($event)">
    <label for="switch" class="switch_label">
      <img src="../../assets/images/sun.png" class="light" alt="">
      <img src="../../assets/images/moon.png" class="dark" alt="">
      <span class="onf_btn"></span>
    </label>
  </div>
</template>

<script>
export default {
  name: 'LightDarkSwitch',
  data() {
    return {
      isDark: false // TODO] theme cookie 에서 auto, dark, light 읽어서 세팅해주기?
    }
  },
  methods: {
    toggle() {
      this.$emit('is-dark', this.isDark)
    }
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
  height: 50px;
  text-align: center;

  #switch {
    position: absolute;
    /* hidden */
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
  }

  /* checking style */
  #switch:checked+.switch_label {
    background: black;
    border: 2px solid black;
  }

  /* move */
  #switch:checked+.switch_label .onf_btn {
    left: 32px;
    background: #fff;
    box-shadow: 1px 2px 3px #00000020;
  }

  .switch_label {
    position: relative;
    cursor: pointer;
    display: inline-block;
    width: 58px;
    height: 28px;
    background: #fff;
    border: 2px solid black;
    border-radius: 20px;
    transition: 0.2s;

    .onf_btn {
      position: absolute;
      top: 2px;
      left: 3px;
      display: inline-block;
      width: 20px;
      height: 20px;
      border-radius: 20px;
      background: black;
      transition: 0.2s;
    }

    .light {
      width: 17px;
      position: absolute;
      right: 3px;
      top: 3px;
    }

    .dark {
      width: 17px;
      position: absolute;
      left: 5px;
      top: 3px;
    }
  }
}
</style>
