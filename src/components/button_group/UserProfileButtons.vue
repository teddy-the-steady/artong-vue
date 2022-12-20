<template>
  <div>
    <router-link :to="{ name: 'ProfileSetting' }">
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
