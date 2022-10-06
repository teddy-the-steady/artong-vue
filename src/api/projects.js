import instance from './index';

const postProject = async function(body) {
  return await instance.post('/projects', body)
}

const patchProject = async function(txHash, body) {
  return await instance.patch(`/projects/${txHash}`, body)
}

const getProjectWhileUpdatingPendingToCreated = async function(txHash) {
  return await instance.get(`/projects/${txHash}/tx_receipt_updated`)
}

const getProject = async function(address) {
  return await instance.get(`/projects/${address}`)
}

const getProjects = async function(params) {
  return await instance.get('/projects', {
    params: {...params}
  })
}
 
export {
  postProject,
  patchProject,
  getProjectWhileUpdatingPendingToCreated,
  getProject,
  getProjects,
}