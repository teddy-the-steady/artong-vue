<template>
  <div>
    <router-link :to="{ name: 'ProfileSettings' }">
      <button>EDIT</button>
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'UserProfileButtons',
}
</script>

<style lang="scss" scoped></style>
