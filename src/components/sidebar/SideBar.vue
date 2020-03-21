<template>
  <nav class="sidebar">
    <div class="sidebar__items">
      <div>H</div>
      <div>T</div>
      <div>F</div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'SideBar'
}
</script>

<style scoped>
.sidebar {
  position: fixed;
  left: 0;
  bottom: 0;
  top: var(--head-height, 50px);
  background-color: var(--lightgray);
  width: 60px;
  /* z-index: 2030; */
}

.sidebar__items {
  display: flex;
  flex-flow: column;
}

@media screen and (max-width: 768px){
  .sidebar {
    display: none;
  }
}
</style>
