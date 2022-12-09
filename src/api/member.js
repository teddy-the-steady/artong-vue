import instance from './index'

const getMemberByUsername = async function (username) {
  return await instance.get(`/members/${username}`)
}

const getCurrentMember = async function () {
  return await instance.get('/current_member')
}

const postMember = async function (walletAddress, principalId) {
  return await instance.post('/member', {
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
  getMemberByUsername,
  getCurrentMember,
  postMember,
  patchMemberProfileS3key,
  patchMember,
}
