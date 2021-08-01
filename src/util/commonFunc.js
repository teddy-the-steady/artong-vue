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

export {
  parseS3Path
}
