import instance from './index'
import axios from 'axios'

const postContent = async function (body) {
  return await instance.post('/contents', body)
}

const patchContent = async function (contentId, body) {
  return await instance.patch(`/contents/${contentId}`, body)
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
    `/projects/${pathParams.projectId}/contents/tobe_approved`,
    {
      params: {
        start_num: queryParams.start_num,
        count_num: queryParams.count_num,
      },
    },
  )
}

export {
  postContent,
  patchContent,
  uploadToNftStorage,
  getContentVoucher,
  getIpfsMetadata,
  getTobeApprovedContents,
}
