import instance from './index';

const postContent = async function(body) {
  return await instance.post('/nft', body)
}

const patchContent = async function(pathParam, body) {
  return await instance.patch(`/nft/${pathParam}`, body)
}

const uploadToNftStorageAndUpdateContent = async function(body) {
  return await instance.post('/nft/storage', body)
}

export {
  postContent,
  patchContent,
  uploadToNftStorageAndUpdateContent,
}