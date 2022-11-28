<template>
  <div>
    <router-link :to="{ name: 'EditUser' }">
      <button>EDIT</button>
    </router-link>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'UserProfileButtons',
  computed: {
    ...mapState({
      currentUser: (state) => state.user.currentUser,
    }),
  },
}
</script>

<style lang="scss" scoped></style>
