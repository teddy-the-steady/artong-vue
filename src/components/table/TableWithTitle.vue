<template>
  <div>
    <div v-if="showHeader" class="header">
      <img :src="iconSrc" />
      <div>{{ tableName }}</div>
    </div>
    <!-- {{ fields[1] }} -->
    <table>
      <th v-for="(field, i) in fields" :key="i">{{ field }}</th>
      <tr v-for="(content, i) in contents" :key="`o-${i}`">
        <td v-for="(field, k) in fields" :key="k">
          <div v-if="field == 'PRICE'">{{ content.price }}</div>
          <div v-else-if="field == 'DATE'">
            {{ content.createdAt ? content.createdAt : content.created_at }}
          </div>
          <div v-else-if="field == 'FROM'">
            <ContentsProfile
              :member="content.from ? content.from : content.from_member"
              :needUserName="true"
            ></ContentsProfile>
          </div>
          <div v-else-if="field == 'TO'">
            <ContentsProfile
              :member="content.to_member"
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
      return results
    },
    async setContents() {
      const tmp = await this.getContents()
      if (tmp) {
        if (tmp.offers) {
          this.contents = tmp.offers // api가 offers인 경우
        } else {
          this.contents = tmp // api가 history인 경우
        }
      }
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
