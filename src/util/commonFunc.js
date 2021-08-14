const setLocalStorageCurrentUserProfilePic = function(key) {
  const currentUser = JSON.parse(localStorage.getItem('current-user'))
  currentUser.profile.profile_pic = key
  localStorage.setItem('current-user', JSON.stringify(currentUser))
  return currentUser
}

export {
  setLocalStorageCurrentUserProfilePic
}
