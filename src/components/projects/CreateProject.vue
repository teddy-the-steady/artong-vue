<template>
  <div>
    <h1>Create Your Project</h1>
    <div class="create-project">
      <div class="card">
        <ProjectPrototypeCard
          :name="name"
          :symbol="symbol"
          :creating="creating"
          @project-background-click="projectBackgroundClick"
          @project-profile-click="projectProfileClick"
        ></ProjectPrototypeCard>
        <input ref="profileInput" type="file" @change="onProfileChange" />
        <input ref="backgroundInput" type="file" @change="onBackgroundChange" />
      </div>
      <div class="info">
        <div>
          <span>Name</span>
          <input type="text" v-model="name" maxlength="100" />
        </div>
        <div>
          <span>Symbol</span>
          <input type="text" class="symbol" v-model="symbol" maxlength="100" />
        </div>
        <div>
          <span>Max Token amount</span>
          <input
            type="text"
            v-model="maxAmount"
            placeholder="positive number"
          />
        </div>
        <div>
          <span>Contribution Policy</span>
          <div class="input-group">
            <input type="radio" id="r1" v-model="policy" value="0" />
            <label for="r1">Immediate</label>
            <input type="radio" id="r2" v-model="policy" value="1" />
            <label for="r2">Approved</label>
          </div>
        </div>
        <button @click="createProject">
          <div class="spinner" :class="{ active: creating }"></div>
          <span v-show="!creating">CREATE PROJECT</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import Storage from '@aws-amplify/storage'
import { ethers } from 'ethers'
import { mapState } from 'vuex'
import { FACTORY_ABI, FACTORY } from '../../contracts'
import { postProject } from '../../api/projects'
import { PENDING } from '../../constants'
import { headerActivate } from '../../mixin'
import Ripple from '../../directives/ripple/Ripple'
import ProjectPrototypeCard from '../projects/ProjectPrototypeCard.vue'
import {
  checkMobileWalletStatusAndGetSigner,
  isSessionValid,
  loginAndRedirectBack,
} from '../../util/commonFunc'

export default {
  name: 'CreateProject',
  components: { ProjectPrototypeCard },
  mixins: [headerActivate],
  computed: {
    ...mapState({
      currentUser: state => state.user.currentUser,
    }),
  },
  directives: {
    ripple: Ripple,
  },
  data() {
    return {
      name: '',
      symbol: '',
      maxAmount: null,
      policy: 0,
      profileImageFile: null,
      backgroundImageFile: null,
      S3_PRIVACY_LEVEL: 'public',
      signer: null,
      creating: false,
    }
  },
  methods: {
    hasNull() {
      let nullField = []
      if (!this.name) {
        nullField.push('name')
      }
      if (!this.symbol) {
        nullField.push('symbol')
      }
      if (!this.maxAmount) {
        nullField.push('max token amount')
      }
      if (nullField.length !== 0) {
        let message = 'Enter '
        for (let i = 0; i < nullField.length; i++) {
          message += nullField[i]
          if (i !== nullField.length - 1) {
            message += ', '
          }
        }
        message += '!'
        alert(message)
        return true
      } else {
        return false
      }
    },
    isPosInt() {
      if (
        isNaN(parseInt(this.maxAmount)) ||
        this.maxAmount <= 0 ||
        this.maxAmount % 1 != 0
      ) {
        alert('Max Token Amount should be positive integer')
        return false
      }
      return true
    },
    async createProject() {
      if (this.hasNull()) return
      if (!this.isPosInt()) return
      if (this.creating === true) {
        return
      }
      this.creating = true
      if (!(await isSessionValid(this.$router.currentRoute.fullPath))) {
        return
      }

      this.signer = await checkMobileWalletStatusAndGetSigner(
        this.$router.currentRoute.fullPath,
      )
      if (!this.signer) {
        return
      }

      let txHash = null
      try {
        const contract = new ethers.Contract(FACTORY, FACTORY_ABI, this.signer)
        const tx = await this._createNFTContract(contract)
        txHash = await this.signer.sendUncheckedTransaction(tx)
      } catch (error) {
        if (error.code == 'ACTION_REJECTED') {
          alert('creating project stopped!')
          this.creating = false
          return
        }
        if (error.message.indexOf('Invalid parameters') > -1) {
          await this.$store.dispatch('AUTH_LOGOUT')
          loginAndRedirectBack(this.$router.currentRoute.fullPath)
          return
        }
      }

      let result1 = null
      let result2 = null
      if (this.profileImageFile && this.backgroundImageFile) {
        ;[result1, result2] = await Promise.all([
          this.uploadProjectProfileImage(txHash),
          this.uploadProjectBackgroundImage(txHash),
        ])
      } else if (this.profileImageFile && !this.backgroundImageFile) {
        result1 = await this.uploadProjectProfileImage(txHash)
      } else if (!this.profileImageFile && this.backgroundImageFile) {
        result2 = await this.uploadProjectBackgroundImage(txHash)
      }

      const postResult = await postProject({
        create_tx_hash: txHash,
        name: this.name,
        symbol: this.symbol,
        status: PENDING,
        project_s3key: result1
          ? `${this.S3_PRIVACY_LEVEL}/${result1.key}`
          : null,
        background_s3key: result2
          ? `${this.S3_PRIVACY_LEVEL}/${result2.key}`
          : null,
      })
      // TODO] tx발행 이후 화면 안넘어가는 이슈. postProject 감안해서 최소한 완료 메세지 보여주기
      if (postResult) {
        this.$router.push({
          name: 'CreatingProject',
          query: { txHash: txHash },
        })
      }
      this.setDefault()
    },
    async _createNFTContract(contract) {
      const tx = await contract.populateTransaction.createNFTContract(
        this.name,
        this.symbol,
        this.maxAmount,
        this.policy,
      )
      return tx
    },
    async uploadProjectProfileImage(txHash) {
      const result = await Storage.put(
        `project/${txHash}/profile/${this.profileImageFile.name}`,
        this.profileImageFile,
        {
          level: this.S3_PRIVACY_LEVEL,
          contentType: this.profileImageFile.type,
        },
      )
      return result
    },
    async uploadProjectBackgroundImage(txHash) {
      const result = await Storage.put(
        `project/${txHash}/background/${this.backgroundImageFile.name}`,
        this.backgroundImageFile,
        {
          level: this.S3_PRIVACY_LEVEL,
          contentType: this.backgroundImageFile.type,
        },
      )
      return result
    },
    projectBackgroundClick() {
      if (this.creating) return
      this.$refs.backgroundInput.click()
    },
    projectProfileClick() {
      if (this.creating) return
      this.$refs.profileInput.click()
    },
    onProfileChange(e) {
      this.profileImageFile = e.target.files[0]
      this.$children[0].$refs.projectProfileImage.src = URL.createObjectURL(
        this.profileImageFile,
      )
      URL.revokeObjectURL(this.profileImageFile)
    },
    onBackgroundChange(e) {
      this.backgroundImageFile = e.target.files[0]
      this.$children[0].$refs.backgroundImage.src = URL.createObjectURL(
        this.backgroundImageFile,
      )
      URL.revokeObjectURL(this.backgroundImageFile)
    },
    setDefault() {
      this.name = ''
      this.symbol = ''
      this.maxAmount = null
      this.profileImageFile = null
      this.backgroundImageFile = null
      this.signer = null
      this.creating = false
      this.$children[0].$refs.projectProfileImage.src = ''
      this.$children[0].$refs.backgroundImage.src = ''
    },
  },
  watch: {
    creating() {},
  },
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/variables';

.create-project {
  display: flex;
  justify-content: center;

  .card {
    input {
      display: none;
    }
  }

  .info {
    border: 1px solid $lightgray;
    padding: 20px;
    margin: 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    div {
      display: flex;
      flex-direction: column;
      text-align: left;

      span {
        margin-bottom: 10px;
      }

      .symbol {
        text-transform: uppercase;
      }

      .input-group {
        display: block;
      }
    }
    button {
      width: 100%;
      margin-left: 10px;
      .spinner {
        display: none;

        &.active {
          display: inline-block;
          position: relative;
          width: 2px;
          margin: 0px auto;
          animation: rotation 0.6s infinite linear;
          border-left: 6px solid rgba(0, 174, 239, 0.15);
          border-right: 6px solid rgba(0, 174, 239, 0.15);
          border-bottom: 6px solid rgba(0, 174, 239, 0.15);
          border-top: 6px solid $artong-white;
          border-radius: 100%;
        }
      }

      @keyframes rotation {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(359deg);
        }
      }
      button {
        width: 100%;
      }

      & > span:nth-child(2) {
        align-self: center;
      }
    }
  }
}

@media only screen and (max-width: 599px) {
  .create-project {
    display: block;

    .info {
      border: none;
      div {
        padding-bottom: 10px;
      }
      button {
        width: 100%;
        margin-left: 10px;
        .spinner {
          display: none;

          &.active {
            display: inline-block;
            position: relative;
            width: 2px;
            margin: 0px auto;
            animation: rotation 0.6s infinite linear;
            border-left: 6px solid rgba(0, 174, 239, 0.15);
            border-right: 6px solid rgba(0, 174, 239, 0.15);
            border-bottom: 6px solid rgba(0, 174, 239, 0.15);
            border-top: 6px solid $artong-white;
            border-radius: 100%;
          }
        }

        @keyframes rotation {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(359deg);
          }
        }
        button {
          width: 100%;
        }

        & > span:nth-child(2) {
          align-self: center;
        }
      }
    }
  }
}
</style>
