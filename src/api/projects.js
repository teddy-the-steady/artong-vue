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

export {
  postProject,
  patchProject,
  getProjectWhileUpdatingPendingToCreated,
  postProjectSubscriber,
  getProjectContributors,
  getMemberContentsCandidates,
}
