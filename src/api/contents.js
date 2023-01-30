import instance from './index'
import axios from 'axios'

const getContent = async function (project_address, contents_id) {
  return await instance.get(
    `/projects/${project_address}/contents/${contents_id}`,
  )
}

const postContent = async function (body) {
  return await instance.post('/contents', body)
}

const patchContent = async function (contentId, body) {
  return await instance.patch(`/contents/${contentId}`, body)
}

const patchContentStatus = async function (project_address, contentId, body) {
  return await instance.patch(
    `/projects/${project_address}/contents/${contentId}/status`,
    body,
  )
}

const uploadToNftStorage = async function (body) {
  return await instance.post('/contents/storage', body)
}

const getContentVoucher = async function (contentId) {
  return await instance.get(`/contents/${contentId}/voucher`)
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
  return await instance.post(`/contents/${contents_id}/reactions`, {
    reaction_code: reaction_code,
  })
}

const searchContents = async function (searchWord) {
  return await instance.get('/search/contents', {
    params: {
      searchWord: searchWord,
    },
  })
}

const getMainContents = async function () {
  return await instance.get('/main/contents')
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
}
