<template>
  <div class="settings">
    <h1>{{ $t('views.settings.title') }}</h1>
    <div class="option-group">
      <!-- <div class="option">
        <label>{{ $t('views.settings.settings.locale') }}</label>
        <LocaleDropdown class="dropdown" :localeOptions="localeOptions" />
      </div> -->
      <div class="option">
        <label>{{ $t('views.settings.settings.language') }}</label>
        <LangDropdown
          class="dropdown"
          :langOptions="langOptions"
          :savedLanguage="language ? language : null"
          @language-selected="languageSelected"
        />
      </div>
      <button class="save" @click="save">
        {{ $t('views.settings.button') }}
      </button>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { languages } from '../../locales/languages'
import { locales } from '../../locales/locales'
import { getCurrentMember, patchMember } from '../../api/member'
// import LocaleDropdown from '../dropdown/LocaleDropdown.vue'
import LangDropdown from '../dropdown/LangDropdown.vue'

export default {
  name: 'Settings',
  components: {
    // LocaleDropdown,
    LangDropdown,
  },
  computed: {
    ...mapState({
      displayLanguage: state => state.user.display_language,
    }),
  },
  data() {
    return {
      localeOptions: locales,
      langOptions: languages,
      member: {
        language_id: 1,
      },
      language: '',
    }
  },
  methods: {
    async save() {
      try {
        await patchMember(this.member.id, {
          language_code: this.language.name,
        })
        alert(this.$i18n.t('common.alert.saved'))
      } catch (error) {
        this.errorMessage = error
      }
    },
    languageSelected(lang) {
      this.language = lang
    },
  },
  async mounted() {
    this.member = await getCurrentMember()
    this.language =
      this.langOptions[languages[this.member.language_code].name] ||
      this.langOptions[this.displayLanguage]
  },
  watch: {
    async $route(val) {
      if (val.name === 'Settings') {
        this.member = await getCurrentMember()
        this.language =
          this.langOptions[languages[this.member.language_code].name] ||
          this.langOptions[this.displayLanguage]
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
  .option-group {
    padding: 40px;
    margin: 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 25%;
    box-shadow: 2px 2px 12px rgb(0 0 0 / 14%);

    .option {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;

      label {
        margin: 0 30px;
      }

      .dropdown {
        position: relative;
        margin-right: 30px;
      }
    }

    .save {
      margin-top: 50px;
    }
  }
}

@media only screen and (max-width: 690px) {
  .settings {
    .option-group {
      border: none;
      margin: 0px;
      width: 100%;
      box-sizing: border-box;
    }
  }
}
</style>
