<template>
  <div>
    <h1>Create Your Project</h1>
    <div class="create-project">
      <div class="card">
        <ProjectPrototypeCard
          :name="name"
          :symbol="symbol"
          @project-background-click="projectBackgroundClick"
          @project-profile-click="projectProfileClick"
        ></ProjectPrototypeCard>
        <input ref="profileInput" type="file" @change="onProfileChange" />
        <input ref="backgroundInput" type="file" @change="onBackgroundChange" />
      </div>
      <div class="info">
        <div>
          <span>Name</span>
          <input type="text" v-model="name" />
        </div>
        <div>
          <span>Symbol</span>
          <input type="text" class="symbol" v-model="symbol" />
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
        <button @click="createProject" v-ripple>CREATE PROJECT</button>
      </div>
    </div>
  </div>
</template>

<script>
import Storage from '@aws-amplify/storage'
import { ethers } from 'ethers'
import { mapState } from 'vuex'
import {
  FACTORY_ABI,
  FACTORY,
  getPcSigner,
  getWalletConnectSigner,
} from '../../contracts'
import { postProject } from '../../api/projects'
import { PENDING } from '../../constants'
import { headerActivate } from '../../mixin'
import Ripple from '../../directives/ripple/Ripple'
import ProjectPrototypeCard from '../projects_v2/ProjectPrototypeCard.vue'

export default {
  name: 'CreateProject',
  components: { ProjectPrototypeCard },
  mixins: [headerActivate],
  computed: {
    ...mapState({
      currentUser: state => state.user.currentUser,
    }),
    isMobile() {
      return this.$isMobile()
    },
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
      signer: null,
      profileImageFile: null,
      backgroundImageFile: null,
      S3_PRIVACY_LEVEL: 'public',
    }
  },
  methods: {
    async createProject() {
      if (!this.signer) {
        if (this.isMobile) {
          this.signer = await getWalletConnectSigner()
        } else {
          this.signer = await getPcSigner()
        }
      }

      const contract = new ethers.Contract(FACTORY, FACTORY_ABI, this.signer)
      const tx = await this._createNFTContract(contract)

      const [result1, result2] = await Promise.all([
        await this.uploadProjectProfileImage(tx.hash),
        await this.uploadProjectBackgroundImage(tx.hash),
      ])

      const postResult = await postProject({
        create_tx_hash: tx.hash,
        name: this.name,
        symbol: this.symbol,
        status: PENDING,
        project_s3key: `${this.S3_PRIVACY_LEVEL}/${result1.key}`,
        background_s3key: `${this.S3_PRIVACY_LEVEL}/${result2.key}`,
      })

      if (postResult) {
        this.$router.push({
          name: 'CreatingProject',
          query: { txHash: tx.hash },
        })
      }
    },
    async _createNFTContract(contract) {
      const tx = await contract.createNFTContract(
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
      this.$refs.backgroundInput.click()
    },
    projectProfileClick() {
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
    }
  }
}
</style>
