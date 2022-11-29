import instance from './index'

const getMembers = async function (username) {
  return await instance.get('/members', {
    params: {
      username: username,
    },
  })
}

const getMember = async function (walletAddress) {
  return await instance.get(`/members/${walletAddress}`)
}

const postMember = async function (walletAddress, principalId) {
  return await instance.post('/members', {
    wallet_address: walletAddress,
    principal_id: principalId,
  })
}

const patchMemberProfileS3key = async function (s3key) {
  return await instance.patch('/members/profile_s3key', {
    profile_s3key: s3key,
  })
}

const patchMember = async function (member_id, { username, introduction }) {
  return await instance.patch(`/members/${member_id}`, {
    username: username,
    introduction: introduction,
  })
}

export {
  getMembers,
  getMember,
  postMember,
  patchMemberProfileS3key,
  patchMember,
}
