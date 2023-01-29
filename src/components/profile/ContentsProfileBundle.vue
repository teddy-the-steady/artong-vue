<template>
  <div class="profile-bundle">
    <div v-if="members.length > 0">
      <ul>
        <li v-for="(val, i) in members" :key="i">
          <router-link
            :to="{
              name: 'UserOrArtist',
              params: {
                id: val.username,
                wallet_address: val.wallet_address,
              },
            }"
          >
            <ContentsProfile
              :needUserName="needUserName"
              :member="val"
              :isFirstLoading="isFirstLoading"
            ></ContentsProfile>
          </router-link>
        </li>
      </ul>
    </div>
    <div v-else>
      <ul>
        <li>
          <ContentsProfile :needUserName="needUserName"></ContentsProfile>
        </li>
        <li>
          <ContentsProfile :needUserName="needUserName"></ContentsProfile>
        </li>
        <li>
          <ContentsProfile :needUserName="needUserName"></ContentsProfile>
        </li>
        <li>
          <ContentsProfile :needUserName="needUserName"></ContentsProfile>
        </li>
        <li>
          <ContentsProfile :needUserName="needUserName"></ContentsProfile>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import ContentsProfile from './ContentsProfile.vue'

export default {
  name: 'ContentsProfileBundle',
  components: {
    ContentsProfile,
  },
  props: {
    members: {
      type: Array,
      default: () => [],
    },
    isFirstLoading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      needUserName: false,
    }
  },
}
</script>

<style lang="scss" scopde>
.profile-bundle {
  div {
    display: flex;
    flex-direction: row;
    position: relative;

    ul {
      list-style: none;
      padding-left: 0px;
      margin: 0px;

      li {
        float: left;
      }

      li:first-child {
        position: relative;
        left: 0px;
        z-index: 5;
      }

      li:nth-child(2) {
        position: relative;
        left: -4px;
        z-index: 4;
      }

      li:nth-child(3) {
        position: relative;
        left: -8px;
        z-index: 3;
      }

      li:nth-child(4) {
        position: relative;
        left: -12px;
        z-index: 2;
      }

      li:nth-child(5) {
        position: relative;
        left: -16px;
        z-index: 1;
      }
    }
  }
}
</style>
