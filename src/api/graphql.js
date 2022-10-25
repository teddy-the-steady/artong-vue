import instance from './index';

const graphql = async function(body) {
  return await instance.post('/graphql', body)
}

export {
  graphql,
}