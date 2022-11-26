<template>
  <div class="wrapper">
    <input type="checkbox" id="switch" />
    <label for="switch" class="switch_label">
      <span class="onf_btn"></span>
    </label>
  </div>
</template>

<script>
export default {
  name: 'OnOffSwitch',
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
  #switch:checked + .switch_label {
    background: black;
    border: 2px solid black;
  }

  /* move */
  #switch:checked + .switch_label .onf_btn {
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
  }
}
</style>
