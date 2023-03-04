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
      <button @click="save">{{ $t('views.project-settings.button') }}</button>
    </div>
    {{ errorMessage }}
  </div>
</template>

<script>
import { graphql, queryProject } from '../../api/graphql'
import { patchProject } from '../../api/projects'

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
      },
      errorMessage: '',
    }
  },
  methods: {
    async save() {
      try {
        await patchProject(this.project.txHash, {
          ...this.project,
        })
        alert(this.$i18n.t('common.alert.saved'))
      } catch (error) {
        this.errorMessage = error
      }
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
