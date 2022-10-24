import instance from './index';
import axios from 'axios';

const postContent = async function(body) {
  return await instance.post('/nft', body)
}

const patchContent = async function(pathParam, body) {
  return await instance.patch(`/nft/${pathParam}`, body)
}

const uploadToNftStorage = async function(body) {
  return await instance.post('/nft/storage', body)
}

const getContent = async function(pathParam) {
  return await instance.get(`/nft/${pathParam}`)
}

const getIpfsMetadata = async function(metadata) {
  return await axios({
    url: `/ipfs/${metadata.ipnft}/metadata.json`,
    baseURL: 'https://ipfs.io'
  })
}

export {
  postContent,
  patchContent,
  uploadToNftStorage,
  getContent,
  getIpfsMetadata,
}