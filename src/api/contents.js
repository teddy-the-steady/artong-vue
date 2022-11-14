import instance from './index';
import axios from 'axios';

const postContent = async function(body) {
  return await instance.post('/contents', body)
}

const patchContent = async function(contentId, body) {
  return await instance.patch(`/contents/${contentId}`, body)
}

const uploadToNftStorage = async function(body) {
  return await instance.post('/contents/storage', body)
}

const getContentVoucher = async function(contentId) {
  return await instance.get(`/contents/${contentId}/voucher`)
}

const getIpfsMetadata = async function(metadata) {
  return await axios({
    url: `/ipfs/${metadata.ipnft}/metadata.json`,
    baseURL: 'https://ipfs.io'
  })
}

const getTobeApprovedContents = async function(projectId) {
  return await instance.get(`/projects/${projectId}/contents/tobe_approved`)
}

export {
  postContent,
  patchContent,
  uploadToNftStorage,
  getContentVoucher,
  getIpfsMetadata,
  getTobeApprovedContents,
}