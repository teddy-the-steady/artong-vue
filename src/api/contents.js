import instance from './index'
import axios from 'axios'

const getContent = async function (project_address, contents_id) {
  const result = await instance.get(
    `/projects/${project_address}/contents/${contents_id}`,
  )
  return result.data
}

const postContent = async function (body) {
  const result = await instance.post('/contents', body)
  return result.data
}

const patchContent = async function (contentId, body) {
  await instance.patch(`/contents/${contentId}`, body)
}

const patchContentStatus = async function (project_address, contentId, body) {
  await instance.patch(
    `/projects/${project_address}/contents/${contentId}/status`,
    body,
  )
}

const uploadToNftStorage = async function (body) {
  const result = await instance.post('/contents/storage', body)
  return result.data
}

const getContentVoucher = async function (contentId) {
  const result = await instance.get(`/contents/${contentId}/voucher`)
  return result.data
}

const getIpfsMetadata = async function (metadata) {
  return await axios({
    url: `/ipfs/${metadata.ipnft}/metadata.json`,
    baseURL: 'https://ipfs.io',
  })
}

const getTobeApprovedContents = async function (pathParams, queryParams) {
  return await instance.get(
    `/projects/${pathParams.address}/contents/tobe_approved`,
    {
      params: {
        start_num: queryParams.start_num,
        count_num: queryParams.count_num,
        order_by: queryParams.orderBy,
        order_direction: queryParams.orderDirection,
      },
    },
  )
}

const postContentReactions = async function (contents_id, reaction_code) {
  const result = await instance.post(`/contents/${contents_id}/reactions`, {
    reaction_code: reaction_code,
  })
  return result.data
}

const searchContents = async function (searchWord) {
  const result = await instance.get('/search/contents', {
    params: {
      searchWord: searchWord,
    },
  })
  return result.data
}

const getMainContents = async function () {
  const result = await instance.get('/main/contents')
  return result.data
}

const getFeedContents = async function (pathParams, queryParams) {
  return await instance.get('/feed', {
    params: {
      start_num: queryParams.start_num,
      count_num: queryParams.count_num,
      order_by: queryParams.orderBy,
      order_direction: queryParams.orderDirection,
    },
  })
}

const getContents = async function (pathParams, queryParams) {
  return await instance.get('/contents', {
    params: {
      start_num: queryParams.start_num,
      count_num: queryParams.count_num,
      order_by: queryParams.orderBy,
      order_direction: queryParams.orderDirection,
    },
  })
}

const getContentsPick = async function (body) {
  return await instance.post('/contents/artongs_pick', body)
}

export {
  getContent,
  postContent,
  patchContent,
  patchContentStatus,
  uploadToNftStorage,
  getContentVoucher,
  getIpfsMetadata,
  getTobeApprovedContents,
  postContentReactions,
  searchContents,
  getMainContents,
  getFeedContents,
  getContents,
  getContentsPick,
}
