import axios from 'axios';

const subgraph = async function(body) {
  return await axios({
    url: '/query/36284/artong-test/v0.0.11',
    baseURL: process.env.VUE_APP_GRAPH_HTTP,
    method: 'POST',
    data: body
  })
}

export {
  subgraph
}