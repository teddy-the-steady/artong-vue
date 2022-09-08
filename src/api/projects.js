import instance from './index';

const postProject = async function(body) {
  return await instance.post('/projects', body)
}
 
export {
  postProject,
}