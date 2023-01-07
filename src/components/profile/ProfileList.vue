<template>
  <div>
    <div class="profiles">
      <div v-for="(val, i) in profileList" :key="i">
        <router-link
          :to="{
            name: 'UserOrArtist',
            params: { id: val.username, wallet_address: val.wallet_address },
          }"
        >
          <ProfileCard :profile="val"></ProfileCard>
        </router-link>
      </div>
    </div>
    <InfiniteLoading
      @infinite="infiniteHandler"
      spinner="spiral"
    ></InfiniteLoading>
  </div>
</template>

<script>
import InfiniteLoading from 'vue-infinite-loading'
import { makeS3Path } from '../../util/commonFunc'
import ProfileCard from '../profile/ProfileCard.vue'

export default {
  name: 'ProfileList',
  components: {
    ProfileCard,
    InfiniteLoading,
  },
  props: {
    apiProfiles: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      profileList: [],
      noMoreDataToLoad: false,
    }
  },
  methods: {
    async infiniteHandler($state) {
      if (this.noMoreDataToLoad) {
        $state.complete()
        return
      }
      await this.pushData()
      setTimeout(function () {
        $state.loaded()
      }, 1000)
    },
    async pushData() {
      let profileArrayToPush = []
      if (!this.apiProfiles.func) {
        return
      }

      const results = await this.getContributors()
      this.apiProfiles.queryParams.start_num +=
        this.apiProfiles.queryParams.count_num
      profileArrayToPush = await this.makeProfileArray(results)
      if (profileArrayToPush.length > 0) {
        for (let i in profileArrayToPush) {
          this.profileList.push(profileArrayToPush[i])
        }
      }
    },
    async makeProfileArray(apiResults) {
      const profileArrayToPush = []

      if (apiResults.length > 0) {
        for (let i = 0; i < apiResults.length; i++) {
          profileArrayToPush.push({
            id: apiResults[i].member_id,
            username: apiResults[i].username,
            wallet_address: apiResults[i].wallet_address,
            profile_s3key: makeS3Path(apiResults[i].profile_s3key),
            profile_thumbnail_s3key: makeS3Path(
              apiResults[i].profile_thumbnail_s3key,
            ),
            contributions: apiResults[i].contributions,
            created_at: apiResults[i].created_at,
            updated_at: apiResults[i].updated_at,
          })
        }
      } else {
        this.noMoreDataToLoad = true
      }

      return profileArrayToPush
    },
    async getContributors() {
      const results = await this.apiProfiles.func(
        this.apiProfiles.pathParams,
        this.apiProfiles.queryParams,
      )
      return results
    },
  },
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/variables';

.profiles {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 200px));
  justify-content: center;
  padding: initial;
}
</style>
