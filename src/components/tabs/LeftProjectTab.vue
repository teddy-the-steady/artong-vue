<template>
  <div>
    <div class="box">
      <div class="red-button">
        {{ project.symbol ? project.symbol.toUpperCase() : '' }}
      </div>
      <div class="collection-name">{{ project.name }}</div>
      <router-link
        :to="{
          name: 'UserOrArtist',
          params: {
            id: project.owner ? project.owner.username : '',
            wallet_address: project.owner ? project.owner.wallet_address : '',
          },
        }"
      >
        <ContentsProfile class="contents-profile" :member="project.owner" />
      </router-link>
      <div class="buttons1">
        <button
          v-if="project.is_subscriber"
          @click="unsubscribe"
          class="subscribe-n-unsubscribe-button white-btn"
        >
          Unsubscribe {{ this.project.subscribers }}
        </button>
        <button
          v-else
          @click="subscribe"
          class="subscribe-n-unsubscribe-button white-btn"
        >
          Subscribe {{ this.project.subscribers }}
        </button>
        <button @click="contribute" v-ripple>Contribute</button>
      </div>
      <div class="detail">
        <div class="top">Items</div>
        <div class="bottom">
          {{ project.max_token_id || 0 }}/{{ project.maxAmount }}
        </div>
      </div>
      <div class="info">
        <div class="info-title">Information</div>
        <div class="info-description">
          {{ project.description }}
        </div>
      </div>
      <SnsLinks :sns="project.sns" />
    </div>
  </div>
</template>
<script>
import ContentsProfile from '../profile/ContentsProfile.vue'
import SnsLinks from '../projects/SnsLinks.vue'
import { isSessionValid } from '../../util/commonFunc'
import { postProjectSubscriber } from '../../api/projects'
import Ripple from '../../directives/ripple/Ripple'

export default {
  name: 'LeftProjectTab',
  components: {
    ContentsProfile,
    SnsLinks,
  },
  props: {
    project: {
      type: Object,
      default: () => {},
    },
  },
  methods: {
    async contribute() {
      if (!(await isSessionValid(this.$router.currentRoute.fullPath))) {
        return
      }
      this.$root.$emit('contribute')
    },
    async subscribe() {
      try {
        await postProjectSubscriber({
          isSubscribeRequest: true,
          targetProjectAddress: this.project.id,
        })
        this.project.subscribers = String(
          parseInt(this.project.subscribers) + 1,
        )
        this.project.is_subscriber = true
        //this.$emit(event:"increaseSubscriber")
      } catch (error) {
        console.log('error 발생')
      }
    },
    async unsubscribe() {
      try {
        await postProjectSubscriber({
          isSubscribeRequest: false,
          targetProjectAddress: this.project.id,
        })
        this.project.subscribers = String(
          parseInt(this.project.subscribers) - 1,
        )
        this.project.is_subscriber = false
      } catch (error) {
        console.log('error 발생')
      }
    },
  },
  directives: {
    ripple: Ripple,
  },
}
</script>
<style lang="scss" scoped>
@import '../../assets/scss/variables';
.box {
  box-sizing: border-box;
  padding: 32px 24px;
  gap: 32px;
  width: 346px;
  background: #ffffff;
  border: 1px solid #cccccc;
  border-radius: 8px;
  .red-button {
    width: 52px;
    height: 25px;
    border: 1px solid #f22e3e;
    border-radius: 999px;
    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    color: #f22e3e;
    line-height: 25px;
  }
  .collection-name {
    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 700;
    font-size: 24px;
    color: #000000;
    text-align: left;
    margin-top: 8px;
  }
  .contents-profile {
    margin-top: 8px;
  }
  .buttons1 {
    display: flex;
    flex-direction: row;
    margin-top: 32px;
    justify-content: space-between;
    button {
      width: 48%;
    }
  }

  .detail {
    font-family: 'Pretendard';
    font-style: normal;
    font-size: 18px;
    text-align: left;
    margin-top: 32px;
    margin-bottom: 32px;
    .top {
      font-weight: 600;
      color: #000000;
      margin-bottom: 8px;
    }
    .bottom {
      font-weight: 400px;
      color: #4d4d4d;
      margin-bottom: 24px;
    }
  }

  .info {
    text-align: left;
    .info-title {
      font-family: 'Pretendard';
      font-style: normal;
      font-weight: 600;
      font-size: 18px;
      color: #000000;
      margin-bottom: 8px;
    }
    .info-description {
      font-family: 'Pretendard';
      font-style: normal;
      font-weight: 400;
      font-size: 16px;
      color: #4d4d4d;
      line-height: 150%;
    }
  }
}
</style>
