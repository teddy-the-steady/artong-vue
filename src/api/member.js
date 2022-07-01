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

const postMember = async function(walletAddress) {
  return await instance.post('/member', {
    wallet_address: walletAddress
  })
}
 
export {
  getMembers,
  getMember,
  postMember,
}