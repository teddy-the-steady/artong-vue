<template>
  <div class="settings">
    <h1>{{ $t('views.project-settings.title') }}</h1>
    <div class="input-group">
      <span class="float-label">
        <input
          id="slug"
          type="text"
          :class="{ filled: project.slug }"
          v-model="project.slug"
          maxlength="100"
        />
        <label for="slug">
          {{ $t('views.project-settings.settings.slug') }}
        </label>
      </span>
      <span class="float-label">
        <textarea
          id="description"
          :class="{ filled: project.description }"
          v-model="project.description"
          maxlength="1000"
        />
        <label for="description">
          {{ $t('views.project-settings.settings.description') }}
        </label>
      </span>
      <span class="float-label">
        <input
          id="instagram"
          type="text"
          :class="{ filled: project.sns.instagram }"
          v-model="project.sns.instagram"
          maxlength="500"
          placeholder="https://"
        />
        <label for="instagram">
          {{ $t('views.project-settings.settings.instagram') }}
        </label>
      </span>
      <span class="float-label">
        <input
          id="twitter"
          type="text"
          :class="{ filled: project.sns.twitter }"
          v-model="project.sns.twitter"
          maxlength="500"
          placeholder="https://"
        />
        <label for="twitter">
          {{ $t('views.project-settings.settings.twitter') }}
        </label>
      </span>
      <span class="float-label">
        <input
          id="discord"
          type="text"
          :class="{ filled: project.sns.discord }"
          v-model="project.sns.discord"
          maxlength="500"
          placeholder="https://"
        />
        <label for="discord">
          {{ $t('views.project-settings.settings.discord') }}
        </label>
      </span>
      <span class="float-label">
        <input
          id="website"
          type="text"
          :class="{ filled: project.sns.website }"
          v-model="project.sns.website"
          maxlength="500"
          placeholder="https://"
        />
        <label for="website">
          {{ $t('views.project-settings.settings.website') }}
        </label>
      </span>
    </div>
    <h1>{{ $t('views.project-settings.title2') }}</h1>
    <div class="input-group">
      <span class="float-label" id="royalty">
        <input
          id="projectRoyalty"
          type="number"
          inputmode="decimal"
          :class="{ filled: project.royalty === 0 || project.royalty }"
          v-model="project.royalty"
          @input="onInputProjectRoyalty"
        />
        %
        <label for="projectRoyalty">
          {{ $t('views.project-settings.settings.royalty') }}
        </label>
        <button @click="updateProjectRoyalty">
          <div class="spinner" :class="{ active: applying }"></div>
          <span v-show="!applying">
            {{ $t('views.project-settings.button.apply') }}
          </span>
        </button>
      </span>
      <div class="balance-group">
        <div>
          <span class="label">{{
            $t('views.project-settings.settings.balance')
          }}</span>
          <span class="balance">
            {{ `${balance} ETH` }}
          </span>
        </div>
        <button
          class="round-button white-button ripple refresh"
          :class="{ refreshing: refreshing }"
          @click="refresh"
        >
          <img src="@/assets/icons/refresh.svg" />
        </button>
        <button class="disabled">
          {{ $t('views.project-settings.button.withdraw') }}
        </button>
      </div>
    </div>
    <button @click="save" class="save">
      <div class="spinner" :class="{ active: saving }"></div>
      <span v-show="!saving">
        {{ $t('views.project-settings.button.save') }}
      </span>
    </button>
    {{ errorMessage }}
  </div>
</template>

<script>
import { ethers } from 'ethers'
import { graphql, queryProject } from '../../api/graphql'
import { patchProject } from '../../api/projects'
import {
  checkMobileWalletStatusAndGetSigner,
  isSessionValid,
  loginAndRedirectBack,
  weiToEther,
} from '../../util/commonFunc'
import Provider from '../../util/walletConnectProvider'
import { MARKETPLACE_ABI, MARKETPLACE } from '../../contracts'

export default {
  name: 'ProjectSetting',
  data() {
    return {
      project: {
        slug: '',
        description: '',
        sns: {
          instagram: '',
          twitter: '',
          discord: '',
          website: '',
        },
        royalty: '',
      },
      applying: false,
      saving: false,
      refreshing: false,
      balance: 0,
      errorMessage: '',
    }
  },
  methods: {
    async save() {
      try {
        this.saving = true
        await patchProject(this.project.txHash, {
          ...this.project,
        })
        alert(this.$i18n.t('views.project-settings.alert.save'))
        this.$router.push({ path: `/projects/${this.project.id}` }).then(() => {
          this.$router.go()
        })
      } catch (error) {
        this.errorMessage = error
      } finally {
        this.saving = false
      }
    },
    onInputProjectRoyalty() {
      if (this.project.royalty > 30) {
        this.project.royalty = '30'
      }
      this.project.royalty = this.project.royalty.match(/^\d+\.?\d{0,2}/)
    },
    async updateProjectRoyalty() {
      if (this.applying === true) {
        return
      }

      if (!(await isSessionValid(this.$router.currentRoute.fullPath))) {
        return
      }

      this.applying = true
      this.signer = await checkMobileWalletStatusAndGetSigner(
        this.$router.currentRoute.fullPath,
      )
      if (!this.signer) {
        this.applying = false
        return
      }

      const contract = new ethers.Contract(
        MARKETPLACE,
        MARKETPLACE_ABI,
        this.signer,
      )

      try {
        const txHash = await this._updateCollectionRoyalty(contract)
        await this.wait(txHash)
        alert(this.$i18n.t('views.project-settings.alert.apply'))
      } catch (error) {
        if (error.code == 'ACTION_REJECTED') {
          return
        }
        if (error.message.indexOf('Invalid parameters') > -1) {
          await this.$store.dispatch('AUTH_LOGOUT')
          loginAndRedirectBack(this.$router.currentRoute.fullPath)
          return
        }
      } finally {
        this.applying = false
      }
    },
    async _updateCollectionRoyalty(contract) {
      if (typeof this.project.royalty === 'object') {
        this.project.royalty = parseInt(this.project.royalty[0])
      }

      const tx = await contract.populateTransaction.updateCollectionRoyalty(
        this.project.id,
        this.project.royalty * 100,
      )
      const txHash = await this.signer.sendUncheckedTransaction(tx)
      return txHash
    },
    async wait(txHash) {
      if (this.isMobile) {
        return await Provider.mobileProvider.waitForTransaction(txHash)
      } else {
        return await Provider.pcProvider.waitForTransaction(txHash)
      }
    },
    async refresh() {
      if (this.refreshing) {
        return
      }

      if (!(await isSessionValid(this.$router.currentRoute.fullPath))) {
        return
      }

      this.signer = await checkMobileWalletStatusAndGetSigner(
        this.$router.currentRoute.fullPath,
      )
      if (!this.signer) {
        return
      }

      const contract = new ethers.Contract(
        MARKETPLACE,
        MARKETPLACE_ABI,
        this.signer,
      )

      try {
        this.refreshing = true
        const collectionRoyaltyBalance = await this.getCollectionRoyalty(
          contract,
        )

        this.balance = weiToEther(collectionRoyaltyBalance[1]._hex)
      } finally {
        this.refreshing = false
      }
    },
    getCollectionRoyalty(contract) {
      return contract.getCollectionRoyalty(this.project.id)
    },
  },
  async mounted() {
    const result = await graphql(
      queryProject({
        variables: {
          id: this.$route.params.project_address,
        },
      }),
    )
    this.project = result.data.project
    this.project.royalty /= 100
    await this.refresh()
  },
  watch: {
    async $route(val) {
      if (val.name === 'ProjectSettings') {
        const result = await graphql(
          queryProject({
            variables: {
              id: val.params.project_address,
            },
          }),
        )
        this.project = result.data.project
        this.project.royalty /= 100
        await this.refresh()
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/variables';

.settings {
  display: flex;
  align-items: center;
  flex-direction: column;
  .input-group {
    padding: 40px;
    margin: 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 25%;
    min-width: 350px;
    box-shadow: 2px 2px 12px rgb(0 0 0 / 14%);
    .float-label {
      margin-bottom: 30px;

      input,
      textarea:first-child {
        width: 100%;
      }

      textarea {
        resize: vertical;
        max-height: 200px;
      }

      &#royalty {
        width: 100%;
        justify-content: space-between;
        align-items: center;

        #projectRoyalty {
          margin-right: 5px;
        }

        button {
          width: 100px;
          margin-left: 10px;
          word-break: keep-all;
        }
      }
    }

    .balance-group {
      display: flex;
      align-items: center;
      justify-content: space-between;
      div {
        text-align: left;
        margin-bottom: 10px;
        flex: 0.8;
        .label {
          font-family: $item-font;
          font-style: $item-font-style;
          font-size: 14px;
        }
        .balance {
          font-family: $item-font;
          font-style: $item-font-style;
          font-size: 20px;
          display: block;
        }
      }
      .refresh {
        &.refreshing {
          img {
            animation: rotation 0.6s infinite linear;
          }
        }
      }
      button {
        margin-left: 10px;
        word-break: keep-all;
      }
    }
  }

  .save {
    width: 100px;
    word-break: keep-all;
    margin: 20px 0;
  }
}

@media only screen and (max-width: 690px) {
  .settings {
    .input-group {
      border: none;
      margin: 0px;
      width: 100%;
      box-sizing: border-box;
    }
  }
}
</style>
