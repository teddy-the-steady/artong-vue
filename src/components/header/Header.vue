<template>
  <nav class="navbar">
    <div class="navbar__side">
      <div class="navbar__menu">
        <!-- <img src="../assets/hambergermenu.png" alt=""> -->
        <burger></burger>
      </div>
    </div>
    <div class="navbar__logo">
      <a href="."><b><i>A</i>rtong</b></a>
    </div>
    <div class="navbar__side">
      <ul class="navbar__icons">
        <li class="profile">
          <img src="../../assets/profilethumb.png" alt="">
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
import Burger from './Burger'

export default {
  name: 'Header',
  components: {
    Burger
  }
}
</script>

<style scoped>
a {
    text-decoration: none;
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
    border: 2px solid var(--lightslategray);
    border-radius: 50%
}
.profile img {
    width: 30px;
    vertical-align: center;
}

@media screen and (max-width: 768px){

}
</style>
