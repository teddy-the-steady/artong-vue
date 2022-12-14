<template>
  <div>
    <h1>Create Your Project</h1>
    <div class="create-project">
      <div class="card">
        <ProjectPrototypeCard
          :name="name"
          :symbol="symbol"
        ></ProjectPrototypeCard>
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

      const postResult = await postProject({
        create_tx_hash: tx.hash,
        name: this.name,
        symbol: this.symbol,
        status: PENDING,
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
  },
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/variables';

.create-project {
  display: flex;
  justify-content: center;

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
