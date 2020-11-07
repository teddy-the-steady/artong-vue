<template>
  <div>
    <ul>
      <li>
        <img src="../../assets/images/heart.png" alt="">
      </li>
      <li>
        <img src="../../assets/images/comment.png" alt="">
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'ActionList'
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/variables';

ul {
  display: flex;
  justify-content: space-around;
  margin: 0;
  padding: 0;
  li {
    list-style-type: none;
    img {
      width: 30px;
    }
  }
}

</style>
