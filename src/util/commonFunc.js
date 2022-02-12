import store from '../store'

const parseS3Path = function(path) {
  path = path.split('/')
  return {
    level: path[0],
    username: path[1],
    type: path[2],
    file: path[3]
  }
}

const setLocalStorageCurrentUserProfilePic = function(key) {
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

export {
  parseS3Path,
  setLocalStorageCurrentUserProfilePic,
  isAuthenticated
}
