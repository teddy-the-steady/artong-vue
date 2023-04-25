import instance from './index'

const postProject = async function (body) {
  const result = await instance.post('/projects', body)
  return result.data
}

const patchProject = async function (txHash, body) {
  if (body.sns) {
    for (let sns in body.sns) {
      if (body.sns[sns] && body.sns[sns].indexOf('http')) {
        body.sns[sns] = 'https://' + body.sns[sns]
      }
    }
  }
  const result = await instance.patch(`/projects/${txHash}`, body)
  return result.data
}

const getProjectWhileUpdatingPendingToCreated = async function (txHash) {
  const result = await instance.get(`/projects/${txHash}/tx_receipt_updated`)
  return result.data
}

const postProjectSubscriber = async function ({
  isSubscribeRequest,
  targetProjectAddress,
  targetProjectName,
  targetProjectOwner,
}) {
  await instance.post('/subscribe', {
    isSubscribeRequest: isSubscribeRequest,
    targetProjectAddress: targetProjectAddress,
    targetProjectName: targetProjectName,
    targetProjectOwner: targetProjectOwner,
  })
}

const getProjectContributors = async function (pathParams, queryParams) {
  return await instance.get(`/projects/${pathParams.address}/contributors`, {
    params: {
      start_num: queryParams.start_num,
      count_num: queryParams.count_num,
    },
  })
}

const getMemberContentsCandidates = async function (pathParams, queryParams) {
  return await instance.get(
    `/members/${pathParams.member_id}/contents/candidates`,
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

const getMemberContentsFavorites = async function (pathParams, queryParams) {
  return await instance.get(
    `/members/${pathParams.member_id}/contents/favorites`,
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

const searchProjects = async function (searchWord) {
  const result = await instance.get('/search/projects', {
    params: { searchWord: searchWord },
  })
  return result.data
}

const getProjectsPrevNext = async function (project_address, prev_next_count) {
  const result = await instance.get('/projects', {
    params: {
      basis_project_address: project_address,
      prev_next_count: prev_next_count,
    },
  })
  return result.data
}

export {
  postProject,
  patchProject,
  getProjectWhileUpdatingPendingToCreated,
  postProjectSubscriber,
  getProjectContributors,
  getMemberContentsCandidates,
  getMemberContentsFavorites,
  searchProjects,
  getProjectsPrevNext,
}
