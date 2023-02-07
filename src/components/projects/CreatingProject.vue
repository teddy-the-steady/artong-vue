<template>
  <div class="container">
    <div v-if="!result">
      <div class="creating-noti">creating project</div>
    </div>
    <div v-else class="result-noti-container">
      <div class="result-noti result-noti-top">project created!</div>
      <router-link
        :to="{
          name: 'Project',
          params: {
            id: this.result.address,
          },
        }"
      >
        <button class="white-button click">Click</button>
      </router-link>
      <span class="result-noti">to see result</span>
    </div>
    <div class="waviy">
      <img
        :class="result ? 'stop' : 'move'"
        style="--i: 1"
        src="../../assets/icons/logo-a.svg"
      />
      <img
        :class="result ? 'stop' : 'move'"
        style="--i: 2"
        src="../../assets/icons/logo-r.svg"
      />
      <img
        :class="result ? 'stop' : 'move'"
        style="--i: 3"
        src="../../assets/icons/logo-t.svg"
      />
      <img
        :class="result ? 'stop' : 'move'"
        style="--i: 4"
        src="../../assets/icons/logo-o.svg"
      />
      <img
        :class="result ? 'stop' : 'move'"
        style="--i: 5"
        src="../../assets/icons/logo-n.svg"
      />
      <img
        :class="result ? 'stop' : 'move'"
        style="--i: 6"
        src="../../assets/icons/logo-g.svg"
      />
    </div>
  </div>
</template>

<script>
import { getProjectWhileUpdatingPendingToCreated } from '../../api/projects'
import { CREATED } from '../../constants'
import { headerActivate } from '../../mixin'

export default {
  name: 'CreatingProject',
  mixins: [headerActivate],
  data() {
    return {
      result: null,
    }
  },
  methods: {
    wait(timeToDelay) {
      return new Promise(resolve => setTimeout(resolve, timeToDelay))
    },
    async getProject(_txHash) {
      for (;;) {
        let answer = await getProjectWhileUpdatingPendingToCreated(_txHash)
        this.result = answer
        if (this.result && this.result.status === CREATED) {
          break
        }
        if (this.$router.currentRoute.name !== 'CreatingProject') {
          break
        }
        await this.wait(3000)
      }
    },
  },
  async mounted() {
    await this.getProject(this.$router.currentRoute.query.txHash)
  },
  watch: {
    async $route(val) {
      if (val.name === 'CreatingProject') {
        this.result = null
        await this.getProject(val.query.txHash)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/variables';

* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

.container {
  background-color: #151719;
  min-height: 100vh;
  // background-color: $artong-black;
  color: $artong-white;
  font-size: 24px;
  .click {
    font-size: 1rem;
    font-weight: 700;
    margin-right: 10px;
    padding: 0.75rem 1.25rem;
    transition: background-color 0.2s, color 0.2s, border-color 0.2s,
      box-shadow 0.2s;
  }
  img {
    height: 60px;
    margin-right: 2px;
  }
}
.result-noti-container {
  transform: translatey(40vh);
  .result-noti {
    font-size: 20px;
  }
  .result-noti-top {
    margin-bottom: 15px;
  }
}

.waviy {
  position: relative;
  -webkit-box-reflect: below -20px linear-gradient(transparent, rgba(0, 0, 0, 0.2));
  transform: translateY(43vh);
}
.creating-noti {
  margin-bottom: 35px;
  font-size: 20px;
  transform: translateY(40vh);
}
.waviy .move {
  position: relative;
  display: inline-block;
  animation: waviy 1s infinite;
  animation-delay: calc(0.1s * var(--i));
}
.stop {
  position: relative;
  display: inline-block;
}
@keyframes waviy {
  0%,
  40%,
  100% {
    transform: translateY(0);
  }
  20% {
    transform: translateY(-20px);
  }
}
</style>
