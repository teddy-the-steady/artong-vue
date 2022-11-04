<template>
  <div>
    {{content}}
  </div>
</template>

<script>
import { headerActivate } from '../../mixin'
import baseLazyLoading from '../../util/baseLazyLoading'
import { graphql } from '../../api/graphql'

export default {
  name: 'Content',
  mixins: [headerActivate],
  data() {
    return {
      content: null
    }
  },
  extends: baseLazyLoading(async (to, callback) => {
    const result = await graphql({query: `
      query Token($id: String) {
        token(id: $id) {
          id
          tokenId
          tokenURI
          contentURI
          _db_voucher
          _db_content_s3key
          project {
            id
          }
        }
      }
      `, variables: {
        id: to.params.project_address + to.params.token_id
      }, db: {
        project_address: to.params.project_address,
        token_id: to.params.token_id
      }
    })
    callback(function() {
      this.content = result.token
    })
  })
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/variables';
</style>
