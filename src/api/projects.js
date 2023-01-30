import instance from './index'

const postProject = async function (body) {
  return await instance.post('/projects', body)
}

const patchProject = async function (txHash, body) {
  return await instance.patch(`/projects/${txHash}`, body)
}

const getProjectWhileUpdatingPendingToCreated = async function (txHash) {
  return await instance.get(`/projects/${txHash}/tx_receipt_updated`)
}

const postProjectSubscriber = async function ({
  isSubscribeRequest,
  targetProjectAddress,
}) {
  return await instance.post('/subscribe', {
    isSubscribeRequest: isSubscribeRequest,
    targetProjectAddress: targetProjectAddress,
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
  return await instance.get('/search/projects', {
    params: { searchWord: searchWord },
  })
}

const getProjectsPrevNext = async function (project_address, prev_next_count) {
  return await instance.get('/projects', {
    params: {
      basis_project_address: project_address,
      prev_next_count: prev_next_count,
    },
  })
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
