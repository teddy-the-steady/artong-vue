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
  const path = parseS3Path(currentUser.profile.profile_pic)
  currentUser.profile.profile_pic = `${path.level}/${key}`
  localStorage.setItem('current-user', JSON.stringify(currentUser))
  return currentUser
}

export {
  parseS3Path,
  setLocalStorageCurrentUserProfilePic
}
