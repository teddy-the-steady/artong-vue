<template>
  <div>
    Username: <input v-model="member.username" />
    <div>
      <button @click="save">SAVE</button>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getMember } from '../../api/member'

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
      },
    }
  },
  methods: {
    save() {},
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
