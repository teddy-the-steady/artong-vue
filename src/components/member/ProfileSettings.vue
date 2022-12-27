<template>
  <div>
    Username: <input type="text" v-model="member.username" /><br />
    Intro: <input type="text" v-model="member.introduction" /><br />
    <div>
      <button @click="save">SAVE</button>
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

<style lang="scss" scoped></style>
