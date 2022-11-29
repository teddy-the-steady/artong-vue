<template>
  <div>
    Username: <input v-model="member.username" /><br />
    Intro: <input v-model="member.introduction" /><br />
    <div>
      <button @click="save">SAVE</button>
    </div>
    {{ errorMessage }}
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getMember, patchMember } from '../../api/member'

export default {
  name: 'ProfileSetting',
  computed: {
    ...mapState({
      currentUser: (state) => state.user.currentUser,
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
      } catch (error) {
        this.errorMessage = error
      }
    },
    async getMember() {
      return await getMember(this.currentUser.wallet_address)
    },
  },
  async mounted() {
    this.member = await this.getMember()
  },
  watch: {
    async $route(val) {
      if (val.name === 'ProfileSetting') {
        this.member = await this.getMember()
      }
    },
  },
}
</script>

<style lang="scss" scoped></style>
