<template>
  <div>
    This is a test
    <TableWithTitle
      :api="queryOffersByToken"
      :tableName="'Offers'"
      :iconSrc="require('@/assets/icons/100-add-folder.svg')"
      :showHeader="true"
      :fields="[
        {
          name: 'PRICE',
          type: 'price',
          key: 'price',
        },
        {
          name: 'DATE',
          type: 'date',
          key: 'createdAt',
        },
        {
          name: 'FROM',
          type: 'member',
          key: 'from',
        },
      ]"
    ></TableWithTitle>
    <div class="divider"></div>
    <!-- <TableWithTitle
      :api="queryTokenHistory"
      :tableName="'History'"
      :iconSrc="require('@/assets/icons/history.svg')"
      :showHeader="true"
      :fields="[
        {
          name: 'PRICE',
          type: 'price',
          key: 'price',
        },
        {
          name: 'From',
          type: 'member',
          key: 'from_member',
        },
        {
          name: 'DATE',
          type: 'date',
          key: 'block_timestamp',
        },
        {
          name: 'TO',
          type: 'member',
          key: 'to_member',
        },
      ]"
    ></TableWithTitle> -->
  </div>
</template>
<script>
import {
  graphql,
  queryOffersByToken,
  queryTokenHistory,
} from '../../api/graphql'
import TableWithTitle from '../table/TableWithTitle.vue'

export default {
  name: 'Test',
  components: {
    TableWithTitle,
  },
  data() {
    return {
      queryOffersByToken: {
        func: null,
        body: {},
      },
      queryTokenHistory: {
        func: null,
        body: {},
      },
    }
  },
  created() {
    this.queryOffersByToken = {
      result_key: 'offers',
      func: graphql,
      body: queryOffersByToken({
        variables: {
          first: 1,
          skip: 0,
          id: '0x4704cf416a4c6dcb7317cd7ac8b4b9e487159eb3' + '2',
          //id: this.$route.params.project_address + this.$route.params.token_id,
        },
      }),
    }
    this.queryTokenHistory = {
      result_key: 'history',
      func: graphql,
      body: queryTokenHistory({
        variables: {
          id: '0x4704cf416a4c6dcb7317cd7ac8b4b9e487159eb3' + '2',
          //id: this.$route.params.project_address + this.$route.params.token_id,
        },
        pagination: {
          start_num: 0,
          count_num: 5,
        },
      }),
    }
  },
}
</script>
<style lang="scss" scoped>
@import '../../assets/scss/variables';

.divider {
  background-color: burlywood;
  width: 100%;
  height: 10px;
}
</style>
