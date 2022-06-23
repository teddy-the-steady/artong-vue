import store from '../store'

const parseS3Path = function(path) {
  path = path.split('/')
  const pathInfo = {
    level: path[0],
    user_id: path[1],
    type: path[2],
    file: path[3]
  }
  return `${process.env.VUE_APP_IMAGE_URL}/${pathInfo.level}/${pathInfo.user_id}/${pathInfo.type}/${pathInfo.file}`
}

const setLocalStorageCurrentUserProfilePic = function(key) { // TODO] profile_pic 말고 다른 key도 set하는 범용 함수 만들자 + user관련 로컬스토리지 조작은 user state에서!!!
  const currentUser = JSON.parse(localStorage.getItem('current-user'))
  currentUser.profile.profile_pic = key
  localStorage.setItem('current-user', JSON.stringify(currentUser))
  return currentUser
}

const isAuthenticated = function() {
  if (store.state.auth.status === 'success') {
    return true
  } 
  return false
}

const getRandomString = function(bytes) {
  const randomValues = new Uint8Array(bytes)
  window.crypto.getRandomValues(randomValues)
  return Array.from(randomValues).map(intToHex).join('')
}

const intToHex = function(nr) {
  return nr.toString(16).padStart(2, '0')
}

export {
  parseS3Path,
  setLocalStorageCurrentUserProfilePic,
  isAuthenticated,
  getRandomString
}
