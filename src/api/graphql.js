import instance from './index';

const graphql = async function(body) {
  return await instance.post('/graphql', body)
}

const queryProject = function(variables) {
  return {
    query: `
      query Project($id: String) {
        project(id: $id) {
          id
          creator
          owner
          name
          symbol
          maxAmount
          policy
          isDisabled
          createdAt
          updatedAt
          _db_project_s3key
          _db_project_thumbnail_s3key
          _db_background_s3key
          _db_background_thumbnail_s3key
        }
      }
    `,
    ...variables
  }
}

const queryProjects = function(variables) {
  return {
    query: `
      query Projects($first: Int, $skip: Int) {
        projects(first: $first, skip: $skip) {
          id
          creator
          owner
          name
          symbol
          maxAmount
          policy
          isDisabled
          createdAt
          updatedAt
          _db_project_s3key
          _db_project_thumbnail_s3key
          _db_background_s3key
          _db_background_thumbnail_s3key
        }
      }
    `,
    ...variables
  }
}

const queryProjectsByCreator = function(variables) {
  return {
    query: `
      query ProjectsByCreator($first: Int, $skip: Int, $creator: String) {
        projects(first: $first, skip: $skip, where: {creator: $creator}) {
          id
          creator
          owner
          name
          symbol
          maxAmount
          policy
          isDisabled
          createdAt
          updatedAt
          _db_project_s3key
          _db_project_thumbnail_s3key
          _db_background_s3key
          _db_background_thumbnail_s3key
        }
      }
    `,
    ...variables
  }
}

const queryToken = function(variables) {
  return {
    query: `
      query Token($id: String) {
        token(id: $id) {
          id
          tokenId
          tokenURI
          contentURI
          _db_voucher
          _db_content_s3key
          project {
            id
          }
        }
      }
    `,
    ...variables
  }
}

const queryTokensByProject = function(variables) {
  return {
    query: `
      query TokensByProject($first: Int, $skip: Int, $project: String) {
        tokens(first: $first, skip: $skip, where: {project: $project}) {
          id
          tokenId
          tokenURI
          contentURI
          creator
          owner
          createdAt
          updatedAt
          _db_voucher
          _db_content_s3key
          _db_content_thumbnail_s3key
          project {
            id
            policy
          }
        }
      }
    `,
    ...variables
  }
}

const queryTokensByCreator = function(variables) {
  return {
    query: `
      query TokensByCreator($first: Int, $skip: Int, $creator: String) {
        tokens(first: $first, skip: $skip, where: {creator: $creator}) {
          id
          tokenId
          tokenURI
          contentURI
          creator
          owner
          createdAt
          updatedAt
          _db_voucher
          _db_content_s3key
          project {
            id
          }
        }
      }
    `,
    ...variables
  }
}

export {
  graphql,
  queryProject,
  queryProjects,
  queryProjectsByCreator,
  queryToken,
  queryTokensByProject,
  queryTokensByCreator,
}