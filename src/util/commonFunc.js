import store from '../store'

const makeS3Path = function(path) {
  if (path) {
    path = path.split('/')
    const pathInfo = {
      level: path[0],
      user_id: path[1],
      type: path[2],
      file: path[3]
    }
    return `${process.env.VUE_APP_IMAGE_URL}/${pathInfo.level}/${pathInfo.user_id}/${pathInfo.type}/${pathInfo.file}`
  }
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
  makeS3Path,
  isAuthenticated,
  getRandomString
}
