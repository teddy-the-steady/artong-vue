<template>
  <div class="notification-modal">
    <infinite-loading v-if="list === []"></infinite-loading>
    <table
      :class="{ left: true, dark: isDark, white: !isDark }"
      v-for="(notification, index) in list"
      :key="notification[index]"
    >
      <td class="sender_img">
        <div class="contents-profile">
          <router-link
            :to="{
              name: 'UserOrArtist',
              params: {
                id: list[index].from.member.username,
              },
            }"
          >
            <ProfileImageBig
              :profileImageUrl="
                handleProfile(list[index].from.member.profile_thumbnail_s3key)
              "
              style="width: 55px; height: 55px"
            ></ProfileImageBig>
          </router-link>
        </div>
      </td>
      <div v-if="$route.path === '/notification'">
        <td class="content">
          {{
            list[index].from.member.username + handleContent(list[index].topic)
          }}
        </td>
      </div>
      <div v-else>
        <td class="content_w">
          {{
            list[index].from.member.username + handleContent(list[index].topic)
          }}
        </td>
      </div>
      <td
        v-if="
          list[index].topic === 'LIKE' || list[index].topic === 'CONTRIBUTE'
        "
        class="post_img"
      >
        <router-link
          :to="{
            name: handleContentType(list[index].content?.project.redeem),
            params: handlePath(
              list[index].content?.project.address,
              list[index].content?.project.slug,
              list[index].content?.project.redeem,
              list[index].content?.id,
              list[index].content?.project.tokenId,
            ),
          }"
        >
          <ProfileImageBig
            :profileImageUrl="
              handleProfile(list[index].content?.content_thumbnail_s3key)
            "
            class="custom-img"
          ></ProfileImageBig>
        </router-link>
      </td>
    </table>
    <infinite-loading @infinite="infiniteHandler"></infinite-loading>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ProfileImageBig from '../profile/ProfileImageBig.vue'
import { makeS3Path } from '../../util/commonFunc'
import InfiniteLoading from 'vue-infinite-loading'
import { getNotifications } from '../../api/notification'

export default {
  name: 'Notification',
  components: { ProfileImageBig, InfiniteLoading },
  data() {
    return {
      isFirstLoading: true,
      page: 1,
      list: [],
    }
  },
  computed: {
    ...mapState({
      isDark: state => state.menu.isDark,
      isNotificationModalOpen: state => state.menu.isNotificationModalOpen,
    }),
  },
  methods: {
    handleContent(content) {
      if (content === 'LIKE') {
        return this.$t('notice.like')
      } else if (content === 'CONTRIBUTE') {
        return this.$t('notice.contribute')
      } else if (content === 'FOLLOW_PROJECT') {
        return this.$t('notice.follow-project')
      } else if (content === 'FOLLOW_MEMBER') {
        return this.$t('notice.follow-member')
      } else if (content === 'CONTRIBUTE_APPROVE') {
        return this.$t('notice.contribute-approve')
      } else if (content === 'COMMENTS') {
        return this.$t('notice.comments')
      }
    },
    handleProfile(profile) {
      return makeS3Path(profile)
    },
    handlePath(address, slug, redeem, content_id, token_id) {
      if (redeem)
        return {
          project_address: slug || address,
          token_id: token_id,
        }
      else
        return {
          project_address: slug || address,
          contents_id: content_id,
        }
    },
    handleContentType(redeem) {
      if (redeem) return 'ContentDetail'
      else return 'ContentCandidateDetail'
    },
    async infiniteHandler($state) {
      let data = await getNotifications(this.page)
      setTimeout(() => {
        if (data.length >= 10) {
          this.page += 1
          this.list = this.list.concat(data)
          $state.loaded()
        } else if (data.length === 0) {
          $state.complete()
        } else if (data.length < 10) {
          this.list = this.list.concat(data)
          $state.complete()
        }
      }, 300)
      console.log(this.list)
    },
  },
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
    .sender_img {
      max-width: 50px;
    }
    .contents-profile {
      flex: 1;
      margin: 8px 8px;
      width: 48px;
      border-radius: 50%;
      cursor: pointer;
    }
    &.dark {
      .content {
        color: white;
        text-align: left;
        margin-left: 10px;
        width: 90vw;
        padding-left: 15px;
      }
    }
    &.white {
      .content {
        color: black;
        text-align: left;
        margin-left: 10px;
        width: 90vw;
        padding-left: 15px;
      }
    }
    ::v-deep(.image) {
      margin-top: 2.5px;
      margin-left: -9px;
      width: 47px;
      height: 47px;
    }
    .content_w {
      text-align: left;
      color: black;
      margin-left: 10px;
      width: 400px;
      padding-left: 15px;
    }
    .post_img {
      display: flex;
      width: 48px;
      height: 62px;
      max-width: 50px;
      padding: 10px 3px;
      margin-right: 8px;
      cursor: pointer;
      .custom-img ::v-deep .image img {
        width: 55px;
        height: 55px;
        border-radius: 10%;
      }
    }
  }
}
</style>
