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
      <button @click="save">{{ $t('views.profile-settings.button') }}</button>
    </div>
    {{ errorMessage }}
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getCurrentMember, patchMember } from '../../api/member'

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
      },
      errorMessage: '',
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
    padding: 40px;
    margin: 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 25%;
    box-shadow: 2px 2px 12px rgb(0 0 0 / 14%);
    .float-label {
      margin-bottom: 30px;

      :first-child {
        width: 100%;
      }

      textarea {
        resize: vertical;
        max-height: 200px;
      }
    }
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
