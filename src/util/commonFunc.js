const parseS3Path = function(path) {
  path = path.split('/')
  return {
    bucket: path[0],
    level: path[1],
    username: path[2],
    type: path[3],
    file: path[4]
  }
}

const setLocalStorageCurrentUserProfilePic = function(key) {
  const currentUser = JSON.parse(localStorage.getItem('current-user'))
  const path = parseS3Path(currentUser.profile.profile_pic)
  currentUser.profile.profile_pic = `${path[0]}/${path[1]}/${key}`
  localStorage.setItem('current-user', JSON.stringify(currentUser))
  return currentUser
}

export {
  parseS3Path,
  setLocalStorageCurrentUserProfilePic
}
