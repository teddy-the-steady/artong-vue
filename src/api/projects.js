import instance from './index';

const postProject = async function(body) {
  return await instance.post('/projects', body)
}

const patchProject = async function(txHash, body) {
  return await instance.patch(`/projects/${txHash}`, body)
}

const getProject = async function(txHash) {
  return await instance.get(`/projects/${txHash}`)
}
 
export {
  postProject,
  patchProject,
  getProject,
}