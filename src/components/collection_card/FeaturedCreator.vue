<template>
  <carousel
    :perPageCustom="[
      [360, 1.9],
      [500, 2.5],
      [600, 3],
      [700, 4],
      [840, 4.5],
      [920, 5],
      [1080, 5.9],
      [1140, 6],
      [1440, 7.9],
      [1920, 8],
    ]"
    :autoplay="false"
    :loop="true"
    :scrollPerPage="false"
    :paginationEnabled="false"
  >
    <slide v-for="(profile, i) in profiles" :key="i" class="slide">
      <router-link
        :to="{
          name: 'UserOrArtist',
          params: {
            id: profile.username,
          },
        }"
      >
        <ProfileCard :profile="profile"></ProfileCard>
      </router-link>
    </slide>
  </carousel>
</template>
<script>
import ProfileCard from '../profile/ProfileCard.vue'

export default {
  name: 'CuratedCollection',
  components: {
    ProfileCard,
  },
  props: {
    profiles: {
      type: Object,
      default: null,
    },
  },
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/variables';

.wrapper {
  //border: 1px solid #333333;
  border-radius: 15px;
  margin-left: 16px;
  margin-right: 8px;
  height: 214px;
  background-color: #1a1a1a;

  font-family: 'Pretendard';
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  color: #ffffff;
  .top {
    div {
      font-family: $item-font;
      font-style: $item-font-style;
      font-weight: 500;
      font-size: 14px;
      color: $artong-white;

      margin-top: 24px;
      margin-bottom: 12px;
    }
    .artist-page-profile {
      display: block;
      margin-left: auto;
      margin-right: auto;
    }
  }

  .bottom {
    div {
      font-family: $item-font;
      font-style: $item-font-style;
      font-weight: 400;
      font-size: 12px;
      line-height: 14px;
      color: #808080;

      margin-top: 12px;
    }
  }
}
</style>
