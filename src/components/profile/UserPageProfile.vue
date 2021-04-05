<template>
  <div class="profile">
    <div class="image">
      <div v-if="profileImage" :src="profileImage" ></div>
      <div v-else></div>
    </div>
    <div class="info">
      <div class="username">
        {{ $route.params.id }}
      </div>
      <div class="display-name">
        {{ currentUser.profile.display_name }}
      </div>
      <div class="intro">
        {{ currentUser.profile.profile_pic }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserPageProfile',
  props: {
    profileImage: {
      type: String,
      default: null
    }
  },
  computed: {
    currentUser() {
      return this.$store.state.auth.currentUser
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/variables';

.profile {
    display: flex;
    width: 70%;

    .image {
        background-color: $artong-white;
        width: 150px;
        height: 150px;
        min-width: 100px;
        min-height: 100px;
        margin-right: 30px;
        border-radius: 50%;
        box-shadow: 1px 1px 4px 0 rgba(0,0,0,.15);;

        div {
          background: url('../../assets/images/profile.svg') 50% 50% no-repeat;
          height: 150px;
          border-radius: 50%;
          cursor: pointer;
        }
    }

    .info {
      display: flex;
      flex-direction: column;
      text-align: left;

      .username {
        font-size: 1.5em;
      }
    }
}

@media only screen and (max-width: 599px) {
  .profile {
    .image {
      width: 100px;
      height: 100px;
      margin-right: 10px;
      div {
        height: 100px;
      }
    }
  }
}
</style>
