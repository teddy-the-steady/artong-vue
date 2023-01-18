<template>
  <div>
    This is a test
    <TableDiv
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
    ></TableDiv>
    <div class="divider"></div>
    <TableDiv
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
    ></TableDiv>
  </div>
</template>
<script>
import {
  graphql,
  queryOffersByToken,
  queryTokenHistory,
} from '../../api/graphql'
import TableDiv from '../table/TableDiv.vue'

export default {
  name: 'Test',
  components: {
    TableDiv,
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
          count_num: 1,
        },
      }),
    }
  },
}
</script>
<style lang="scss" scoped>
@import '../../assets/scss/variables';
* {
  margin: 0;
  padding: 0;
}
html,
body,
.wrapper {
  width: 100%;
  height: 100vh;
}
.wrapper .tableBox {
  position: relative;
  top: 50px;
  left: 50px;
  width: 700px;
  height: 100px;
  overflow-y: scroll;
  border-top: 2px solid dodgerblue;
}
.tableData {
  width: 100%;
  border-collapse: collapse;
  text-align: center;
}
.tableData thead tr th {
  position: sticky;
  top: 0;
  background: #ebeaea;
}
.tableData thead tr th,
.tableData tbody tr td {
  padding: 15px 0;
  box-sizing: border-box;
  border-bottom: 1px solid #dedede;
  border-right: 1px solid #ddd;
  word-break: break-all;
}
.divider {
  background-color: burlywood;
  width: 100%;
  height: 10px;
}
</style>
