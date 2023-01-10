<template>
  <div>
    <div v-if="showHeader" class="header">
      <img :src="iconSrc" />
      <div>{{ tableName }}</div>
    </div>
    <!-- {{ fields[1] }} -->
    <table>
      <th v-for="(field, i) in fields" :key="i">{{ field }}</th>
      <tr v-for="(content, i) in contents" :key="i">
        <td v-for="(field, i) in fields" :key="i">
          <div v-if="field == 'PRICE'">{{ content.price }}</div>
          <div v-else-if="field == 'DATE'">{{ content.createdAt }}</div>
          <div v-else-if="field == 'FROM'">
            <ContentsProfile
              :member="content.from"
              :needUserName="true"
            ></ContentsProfile>
          </div>
        </td>
      </tr>
    </table>
  </div>
</template>
<script>
import ContentsProfile from '../profile/ContentsProfile.vue'

export default {
  name: 'TableWithTitle',
  components: {
    ContentsProfile,
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
