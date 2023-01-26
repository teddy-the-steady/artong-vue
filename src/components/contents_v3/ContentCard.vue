<template>
  <div class="wrapper">
    <div class="top" @click="onContentClick">
      <img :src="contentImage" alt="" />
      <ProjectPageProfile_small
        v-if="needContentName"
        class="project-profile"
        :project="content.project"
      ></ProjectPageProfile_small>
    </div>
    <div class="bottom">
      <router-link
        :to="{
          name: 'UserOrArtist',
          params: { id: content ? content.owner.username : '' },
        }"
        class="profile-link"
      >
        <ContentsProfile
          :member="content ? content.owner : null"
          class="content-profile"
        ></ContentsProfile>
      </router-link>
      <div v-show="price">
        <div class="price-title">PRICE</div>
        <div class="price">{{ price }} ETH</div>
      </div>
    </div>
  </div>
</template>

<script>
import ProjectPageProfile_small from '../profile/ProjectPageProfile_small.vue'
import ContentsProfile from '../profile/ContentsProfile.vue'
import { makeS3Path, weiToEther } from '../../util/commonFunc'
import { graphql, queryProject } from '../../api/graphql'

export default {
  name: 'ContentCard',
  components: {
    ProjectPageProfile_small,
    ContentsProfile,
  },
  computed: {
    contentImage() {
      return (
        this.makeS3Path(this.content.content_thumbnail_s3key) ||
        this.makeS3Path(this.content.content_s3key)
      )
    },
    price() {
      let result = null
      if (this.content.listings && this.content.listings.length > 0) {
        const listing = this.content.listings[0]
        if (['LISTED', 'UPDATED'].includes(listing.eventType)) {
          result = weiToEther(listing.price)
        }
      } else if (this.content.price) {
        result = weiToEther(parseInt(this.content.price).toString())
      }
      return result
    },
  },
  props: {
    content: {
      type: Object,
      default: null,
    },
    needContentName: {
      type: Boolean,
      default: true,
    },
  },
  methods: {
    makeS3Path(path) {
      return makeS3Path(path)
    },
    background(content) {
      if (content) {
        return (
          this.makeS3Path(content.content_thumbnail_s3key) ||
          this.makeS3Path(content.content_s3key)
        )
      } else {
        return require('@/assets/images/art11.jpg')
      }
    },
    onContentClick() {
      if (this.content.tokenId) {
        this.$router.push({
          name: 'ContentDetail',
          params: {
            project_address: this.content.project_address,
            token_id: this.content.tokenId,
          },
        })
      } else if (this.content.id) {
        this.$router.push({
          name: 'ContentCandidateDetail',
          params: {
            project_address: this.content.project_address,
            contents_id: this.content.id,
          },
        })
      }
    },
  },
  async created() {
    this.content.project = await graphql(
      queryProject({
        variables: {
          id: this.content.id,
        },
      }),
    )
    this.content.project = this.content.project.project
  },
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/variables';

.wrapper {
  border: 1px solid #333333;
  border-radius: 15px;
  margin: 24px 16px;
  height: 453px;
  position: relative;

  .top {
    display: flex;
    height: 330px;
    cursor: pointer;

    img {
      border-top-left-radius: 15px;
      border-top-right-radius: 15px;
      width: 100%;
      object-fit: cover;
    }

    .project-profile {
      position: absolute;
      margin-top: 24px;
      margin-left: 16px;
    }
    .description {
      margin-top: 292px;
      margin-left: 16px;

      font-family: $item-font;
      font-style: $item-font-style;
      font-weight: 700;
      font-size: 18px;
      color: $artong-white;
    }
  }

  .bottom {
    position: absolute;
    display: flex;
    width: 100%;
    flex-direction: column;
    margin: 16px 0;
    height: 32px;
    .profile-link {
      .content-profile {
        margin-left: 16px;
      }
    }

    .price-title {
      margin-top: 16px;
      margin-left: 16px;
      text-align: left;
      font-family: $item-font;
      font-style: $item-font-style;
      font-weight: 500;
      font-size: 14px;
      color: #808080;
    }
    .price {
      margin-top: 4px;
      margin-left: 16px;
      text-align: left;
      font-family: $item-font;
      font-style: $item-font-style;
      font-weight: 500;
      font-size: 18px;
      color: $artong-black;
    }
  }
}
</style>
