import instance from './index';

const postProject = async function(body) {
  return await instance.post('/projects', body)
}

const patchProject = async function(txHash, body) {
  return await instance.patchProject(`/projects/${txHash}`, body)
}
 
export {
  postProject,
  patchProject,
}