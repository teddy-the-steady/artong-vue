import instance from './index'

const getMemberByUsername = async function (username) {
  const result = await instance.get(`/members/${username}`)
  return result.data
}

const getCurrentMember = async function () {
  const result = await instance.get('/current_member')
  return result.data
}

const postMember = async function (walletAddress, principalId) {
  const result = await instance.post('/member', {
    wallet_address: walletAddress,
    principal_id: principalId,
  })
  return result.data
}

const patchMemberProfileS3key = async function (s3key) {
  await instance.patch('/members/profile_s3key', {
    profile_s3key: s3key,
  })
}

const patchMember = async function (member_id, { username, introduction }) {
  await instance.patch(`/members/${member_id}`, {
    username: username,
    introduction: introduction,
  })
}

const postMemberFollower = async function ({
  isFollowRequest,
  targetMemberId,
}) {
  const result = await instance.post('/follow', {
    isFollowRequest: isFollowRequest,
    targetMemberId: targetMemberId,
  })
  return result.data
}

const searchMembers = async function (searchWord) {
  const result = await instance.get('/search/members', {
    params: { searchWord: searchWord },
  })
  return result.data
}

const getMainContributors = async function () {
  const result = await instance.get('/main/contributors')
  return result.data
}

export {
  getMemberByUsername,
  getCurrentMember,
  postMember,
  patchMemberProfileS3key,
  patchMember,
  postMemberFollower,
  searchMembers,
  getMainContributors,
}
