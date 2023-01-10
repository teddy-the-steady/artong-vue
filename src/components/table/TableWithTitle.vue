<template>
  <div>
    <div v-if="showHeader" class="header">
      <img :src="iconSrc" />
      <div>{{ tableName }}</div>
    </div>
    <!-- {{ fields[1] }} -->
    <table>
      <th></th>
    </table>
    <div v-if="this.contents">
      {{ contents[0].price }}
      {{ contents[0].from.id }}
      {{ contents[0].createdAt }}
    </div>
  </div>
</template>
<script>
//import ContentsProfile from '../profile/ContentsProfile.vue'

export default {
  name: 'TableWithTitle',
  components: {
    //ContentsProfile,
  },
  data() {
    return {
      contents: null,
    }
  },
  props: {
    api: {
      type: Object,
      default: null,
    },
    tableName: {
      type: String,
      default: null,
    },
    iconSrc: {
      type: String,
      default: null,
    },
    showHeader: {
      type: Boolean,
      default: false,
    },
    fields: {
      type: Array,
      default: null,
    },
  },
  methods: {
    async getContents() {
      const results = await this.api.func(this.api.body)
      if (results) {
        return results.offers
      }
    },
    async setContents() {
      this.contents = await this.getContents()
      if (this.contents) {
        console.log(this.contents)
      }
    },
  },
  async mounted() {
    await this.setContents()
  },
}
</script>
<style lang="scss" scoped>
@import '../../assets/scss/variables';

.header {
  display: flex;
}
</style>
