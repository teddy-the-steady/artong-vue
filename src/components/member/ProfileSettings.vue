<template>
  <div class="settings">
    <h1>{{ $t('views.profile-settings.title') }}</h1>
    <div class="input-group">
      <span class="float-label">
        <input
          id="username"
          type="text"
          :class="{ filled: member.username }"
          v-model="member.username"
          maxlength="100"
        />
        <label for="username">
          {{ $t('views.profile-settings.settings.username') }}
        </label>
      </span>
      <span class="float-label">
        <input
          id="email"
          type="text"
          :class="{ filled: member.email }"
          v-model="member.email"
          maxlength="100"
        />
        <label for="email">
          {{ $t('views.profile-settings.settings.email') }}
        </label>
        <button class="email" @click="sendEmailVerification" v-if="!verified">
          <div class="spinner" :class="{ active: sending }"></div>
          <span v-show="!sending">
            {{ $t('views.profile-settings.button.send') }}
          </span>
        </button>
        <button class="disabled email" @click="verify" v-else>
          {{ $t('views.profile-settings.button.verified') }}
        </button>
      </span>
      <span class="code" v-if="verificationCodeAnswer">
        <input
          type="text"
          maxlength="6"
          v-model="verificationCodeEntered"
          :placeholder="$t('views.profile-settings.settings.code')"
        />
        <button
          class="verify"
          :class="{ shake: shakeAnimation }"
          @click="verify"
        >
          <div class="spinner" :class="{ active: verifying }"></div>
          <span v-show="!verifying">
            {{ $t('views.profile-settings.button.verify') }}
          </span>
        </button>
      </span>
      <span class="float-label">
        <textarea
          id="intro"
          :class="{ filled: member.introduction }"
          v-model="member.introduction"
          maxlength="400"
        />
        <label for="intro">
          {{ $t('views.profile-settings.settings.intro') }}
        </label>
      </span>
      <button @click="save" class="save">
        {{ $t('views.profile-settings.button.save') }}
      </button>
    </div>
    {{ errorMessage }}
  </div>
</template>

<script>
import { mapState } from 'vuex'
import {
  getCurrentMember,
  patchMember,
  sendEmailVerification,
  verifyEmail,
} from '../../api/member'

export default {
  name: 'ProfileSettings',
  computed: {
    ...mapState({
      currentUser: state => state.user.currentUser,
    }),
  },
  data() {
    return {
      member: {
        username: '',
        introduction: '',
        email: '',
      },
      errorMessage: '',
      verificationCodeAnswer: '',
      verificationCodeEntered: '',
      verified: false,
      verifying: false,
      sending: false,
      shakeAnimation: false,
    }
  },
  methods: {
    async save() {
      try {
        await patchMember(this.member.id, {
          username: this.member.username,
          introduction: this.member.introduction,
        })
        alert(this.$i18n.t('common.alert.saved'))
        this.$router
          .push({
            name: 'UserOrArtist',
            params: {
              id: this.currentUser.username,
              wallet_address: this.currentUser.wallet_address,
            },
          })
          .then(() => {
            this.$router.go()
          })
      } catch (error) {
        this.errorMessage = error
      }
    },
    async sendEmailVerification() {
      // TODO] 이메일 포맷 확인
      if (!this.member.email) {
        alert(this.$i18n.t('views.profile-settings.alert.email_empty'))
        return
      }

      this.sending = true
      try {
        const result = await sendEmailVerification(this.member.email)
        this.verificationCodeAnswer = result
      } catch (error) {
        this.errorMessage = error
      } finally {
        this.sending = false
      }
    },
    async verify() {
      if (
        this.verificationCodeAnswer === parseInt(this.verificationCodeEntered)
      ) {
        this.verifying = true
        try {
          await verifyEmail(this.member.email)
        } catch (error) {
          this.errorMessage = error
        } finally {
          this.verifying = false
          this.verificationCodeAnswer = ''
          this.verified = true
        }
      } else {
        this.shakeAnimation = true
        setTimeout(() => {
          this.shakeAnimation = false
        }, 1000)
      }
    },
  },
  async mounted() {
    this.member = await getCurrentMember()
  },
  watch: {
    async $route(val) {
      if (val.name === 'ProfileSettings') {
        this.member = await getCurrentMember()
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.settings {
  display: flex;
  align-items: center;
  flex-direction: column;
  .input-group {
    padding: 20px 40px 40px 40px;
    margin: 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 25%;
    box-shadow: 2px 2px 12px rgb(0 0 0 / 14%);
    .float-label {
      margin-top: 30px;

      input,
      textarea {
        width: 100%;
      }

      textarea {
        resize: vertical;
        max-height: 200px;
      }

      .email {
        width: 44%;
        margin-left: 10px;
      }
    }

    .code {
      display: flex;
      margin-top: 10px;

      input {
        width: 100%;
      }

      .verify {
        width: 44%;
        margin-left: 10px;

        &.shake {
          animation: horizontal-shaking 0.15s;
        }
      }

      @keyframes horizontal-shaking {
        0% {
          transform: translateX(0);
        }
        25% {
          transform: translateX(5px);
        }
        50% {
          transform: translateX(-5px);
        }
        75% {
          transform: translateX(5px);
        }
        100% {
          transform: translateX(0);
        }
      }
    }
  }

  .save {
    margin-top: 30px;
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
