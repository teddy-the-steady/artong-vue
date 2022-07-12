<template>
  <div>
    <div class="header">
      <div class="user-info">
        <artist-page-profile :username="username"></artist-page-profile>
      </div>
      <div class="tab">
      </div>
    </div>
    <content-list></content-list>
  </div>
</template>

<script>
import { headerActivate } from '../../mixin'
import ContentList from '../contentsV2/ContentList'
import ArtistPageProfile from '../profile/ArtistPageProfile'

export default {
  name: 'NFT',
  mixins: [headerActivate],
  components: {
    ContentList, ArtistPageProfile
  },
  data() {
    return {
      info: ''
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/variables';

h1, h2 {
  color: $artong-black;
}

.header {
  .user-info {
    height: 30%;
    display: flex;
    justify-content: space-evenly;
    align-items: flex-end;
    padding: 50px 15px 15px 15px;

    button {
      padding: 10px;
      border-radius: 10px;
    }
  }

  .tab {
    height: 50px;
  }
}

.contents {
  padding: 0 10%;
}

@media only screen and (max-width: 599px) {
  .header {
    .user-info {
      padding: 30px 15px 15px 15px;

      button {
        border-radius: 10px;
      }
    }
  }

  .contents {
    padding: 0;
  }
}
</style>
