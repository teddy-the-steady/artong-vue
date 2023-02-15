<template>
  <div class="settings">
    <h1>{{ $t('views.settings.title') }}<TooltipIcon :tip="'fffffffff'" /></h1>
    <div class="option-group">
      <div class="option">
        <label>{{ $t('views.settings.settings.locale') }}</label>
        <LocaleDropdown class="dropdown" :localeOptions="localeOptions" />
      </div>
      <div class="option">
        <label>{{ $t('views.settings.settings.language') }}</label>
        <LangDropdown class="dropdown" :langOptions="langOptions" />
      </div>
      <button class="save">{{ $t('views.settings.button') }}</button>
    </div>
  </div>
</template>

<script>
import { languages } from '../../locales/languages'
import LocaleDropdown from '../dropdown/LocaleDropdown.vue'
import LangDropdown from '../dropdown/LangDropdown.vue'
import TooltipIcon from '../util/ToolTipIcon.vue'

export default {
  name: 'Settings',
  components: { LocaleDropdown, LangDropdown, TooltipIcon },
  data() {
    return {
      localeOptions: {
        ko: {
          name: 'ko',
          text: '한국',
        },
        en: {
          name: 'en',
          text: 'USA',
        },
      },
      langOptions: languages,
    }
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
