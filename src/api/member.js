import instance from './index';
 
const getMembers = async function(username) {
  return await instance.get('/members', {
    params: {
      username: username
    }
  })
}

const getMember = async function(walletAddress) {
  return await instance.get(`/members/${walletAddress}`)
}

const postMember = async function(walletAddress, principalId) {
  return await instance.post('/members', {
    wallet_address: walletAddress,
    principal_id: principalId
  })
}
 
export {
  getMembers,
  getMember,
  postMember,
}