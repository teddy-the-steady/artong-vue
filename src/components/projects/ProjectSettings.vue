<template>
  <div>
    Description: <input type="text" v-model="project.description" /><br />
    Instragram: <input type="text" v-model="project.sns.instagram" /><br />
    Twitter: <input type="text" v-model="project.sns.twitter" /><br />
    Discord: <input type="text" v-model="project.sns.discord" /><br />
    Website: <input type="text" v-model="project.sns.website" /><br />
    <div>
      <button @click="save">SAVE</button>
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
    this.project = result.project
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
        this.project = result.project
      }
    },
  },
}
</script>

<style lang="scss" scoped></style>
