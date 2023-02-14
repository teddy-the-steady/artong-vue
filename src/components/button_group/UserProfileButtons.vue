<template>
  <div>
    <router-link :to="{ name: 'ProfileSettings' }">
      <button>{{ $t('views.user.button.edit') }}</button>
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'UserProfileButtons',
}
</script>

<style lang="scss" scoped>
button {
  width: 100%;
}
</style>
