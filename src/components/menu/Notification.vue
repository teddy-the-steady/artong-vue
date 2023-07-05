<template>
  <div class="notification-modal">
    <table
      class="left"
      v-for="(notification, index) in displayedNotifications"
      :key="index"
      :notification="notification"
    >
      <td class="sender_img">
        <div class="header-profile">
          <HeaderProfile />
        </div>
      </td>
      <td class="content">
        {{ notification.sender_id + notification.message }}
      </td>
      <!-- <td class="post_img"><img :src="notification.post_img" /></td> -->
      <td class="post_img"><img src="../../assets/images/posttest.png" /></td>
      <!-- <td class="post_img">{{ notification.post_img }}</td> -->
    </table>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import HeaderProfile from '../profile/HeaderProfile.vue'

export default {
  name: 'Notification',
  components: { HeaderProfile },
  data() {
    return {
      notification: [
        // 알림 데이터를 가져오는 API 호출을 사용하십시오.
        {
          sender_img: 'a',
          sender_id: 'lena',
          message: this.$t('notice.like'),
          post_img: '../../assets/images/posttest.png',
        },
        {
          sender_img: 'b',
          sender_id: 'lena',
          message: this.$t('notice.follow'),
          post_img: 'img',
        },
        {
          sender_img: 'b',
          sender_id: 'lena',
          message: this.$t('notice.comments'),
          post_img: 'img',
        },
        {
          sender_img: 'a',
          sender_id: 'lena',
          message: this.$t('notice.like'),
          post_img: '../../assets/images/posttest.png',
        },
        {
          sender_img: 'b',
          sender_id: 'lena',
          message: this.$t('notice.follow'),
          post_img: 'img',
        },
        {
          sender_img: 'b',
          sender_id: 'lena',
          message: this.$t('notice.comments'),
          post_img: 'img',
        },
        {
          sender_img: 'a',
          sender_id: 'lena',
          message: this.$t('notice.like'),
          post_img: '../../assets/images/posttest.png',
        },
        {
          sender_img: 'b',
          sender_id: 'lena',
          message: this.$t('notice.follow'),
          post_img: 'img',
        },
        {
          sender_img: 'b',
          sender_id: 'lena',
          message: this.$t('notice.comments'),
          post_img: 'img',
        },
        // ...
      ],
      // loadCount: 5,
    }
  },
  computed: {
    ...mapState({
      currentUser: state => state.user.currentUser,
      isDark: state => state.menu.isDark,
      isNotificationModalOpen: state => state.menu.isNotificationModalOpen,
      displayedNotifications() {
        return this.notification
      },
    }),
  },
  methods: {
    // handleScroll(event) {
    //   const { target } = event
    //   if (target.scrollTop + target.clientHeight >= target.scrollHeight) {
    //     this.loadMore()
    //   }
    // },
    // loadMore() {
    //   if (this.loadCount < this.notifications.length) {
    //     this.loadCount += 5
    //   }
    // },
  },
  watch: {},
}
</script>

<style lang="scss" scoped>
.notification-modal {
  .left {
    display: flex;
    flex-direction: row;
    align-content: center;
    align-items: center;
    width: 100%;
    border-collapse: collapse;
    border-bottom: 1px solid #44444464;
    // vertical-align: middle;
    .sender_img {
      max-width: 50px;
    }
    .header-profile {
      // float: left;
      flex: 1;
      margin: 8px 5px;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      cursor: pointer;
    }
    .content {
      text-align: left;
      margin-left: 10px;
      width: 90vw;
      padding: 15px 10px;
    }
    .post_img {
      // float: right;
      display: flex;
      width: 48px;
      height: 48px;
      max-width: 50px;
      padding: 15px 3px;
      margin-right: 8px;
      cursor: pointer;
      img {
        width: 48px;
        height: 48px;
      }
    }
  }
}

@media only screen and (max-width: 690px) {
  // .notification-modal {
  //   .left {
  //     display: table;
  //     .content {
  //       float: left;
  //       text-align: left;
  //       margin-left: 10px;
  //       width: 220px;
  //       padding: 15px 10px;
  //     }
  //     .post_img {
  //       float: right;
  //       width: 48px;
  //       height: 48px;
  //       max-width: 50px;
  //       padding: 15px 3px;
  //       margin-right: 8px;
  //       cursor: pointer;
  //       img {
  //         float: right;
  //         width: 48px;
  //         height: 48px;
  //       }
  //     }
  //   }
  // }
}
</style>
