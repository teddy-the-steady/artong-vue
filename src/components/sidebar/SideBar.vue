<template>
  <nav class="sidebar">
    <div class="sidebar__items">
      <div></div>
      <div></div>
      <div></div>
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
  overflow-y: auto;
  background-color: var(--lightgray);
  position: fixed;
  left: 0;
  top: var(--head-height, 50px);
  height: 100%;
  z-index: 999;
  width: 60px;
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
