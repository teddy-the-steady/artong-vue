import instance from './index'

const graphql = async function (body) {
  return await instance.post('/graphql', body)
}

const queryProject = function (variables) {
  return {
    query: `
      query Project($id: String) {
        project(id: $id) {
          id
          txHash
          creator
          owner
          name
          symbol
          maxAmount
          policy
          isDisabled
          royalty
          createdAt
          updatedAt
          _db_project_s3key
          _db_project_thumbnail_s3key
          _db_background_s3key
          _db_background_thumbnail_s3key
          _db_description
          _db_sns
          _db_subscribers
          _db_max_token_id
          _db_is_subscriber
          _db_is_contributor
          _db_slug
          _db_token_count
          _db_tokens_tobe_approved_count
          _db_name
        }
      }
    `,
    ...variables,
  }
}

const queryProjects = function (variables) {
  return {
    query: `
      query Projects($first: Int, $skip: Int, $orderBy: String, $orderDirection: String) {
        projects(first: $first, skip: $skip, orderBy: $orderBy, orderDirection: $orderDirection) {
          id
          txHash
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
          _db_create_tx_hash
          _db_description
          _db_status
          _db_member_id
          _db_slug
          _db_name
        }
      }
    `,
    ...variables,
  }
}

const queryHighlightedProjects = function (variables) {
  return {
    query: `
    query Projects($idArray: [String]) {
      projects(where: {id_in: $idArray}) {
        id
        txHash
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
        _db_create_tx_hash
        _db_description
        _db_status
        _db_member_id
        _db_slug
      }
    }`,
    ...variables,
  }
}

const queryProjectsByCreator = function (variables) {
  return {
    query: `
      query ProjectsByCreator($first: Int, $skip: Int, $creator: String, $orderBy: String, $orderDirection: String) {
        projects(first: $first, skip: $skip, where: {creator: $creator}, orderBy: $orderBy, orderDirection: $orderDirection) {
          id
          txHash
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
          _db_create_tx_hash
          _db_description
          _db_status
          _db_member_id
          _db_slug
          _db_name
        }
      }
    `,
    ...variables,
  }
}

const queryToken = function (variables) {
  return {
    query: `
      query Token($id: String) {
        token(id: $id) {
          id
          tokenId
          tokenURI
          contentURI
          creator
          owner
          royalty
          createdAt
          updatedAt
          project {
            id
            name
            symbol
            royalty
          }
          listings (orderBy: createdAt, orderDirection: desc, first: 1) {
            id
            from
            price
            eventType
            createdAt
          }
          _db_id
          _db_member_id
          _db_voucher
          _db_name
          _db_description
          _db_content_thumbnail_s3key
          _db_content_s3key
          _db_like
          _db_total_likes
        }
      }
    `,
    ...variables,
  }
}

const queryTokensInIdArray = function (variables) {
  return {
    query: `
    query Tokens($idArray: [String]) {
      tokens(where: {id_in: $idArray}) {
        id
        tokenId
        tokenURI
        contentURI
        creator
        owner
        createdAt
        updatedAt
        project {
          id
          name
        }
        _db_member_id
        _db_voucher
        _db_name
        _db_description
        _db_content_thumbnail_s3key
        _db_content_s3key
      }
    }
    `,
    ...variables,
  }
}

const queryTokens = function (variables) {
  return {
    query: `
    query Tokens($first: Int, $skip: Int, $orderBy: String, $orderDirection: String) {
      tokens(first: $first, skip: $skip, orderBy: $orderBy, orderDirection: $orderDirection) {
        id
        tokenId
        tokenURI
        contentURI
        creator
        owner
        createdAt
        updatedAt
        project {
          id
          name
        }
        _db_member_id
        _db_voucher
        _db_name
        _db_description
        _db_content_thumbnail_s3key
        _db_content_s3key
      }
    }`,
    ...variables,
  }
}

const queryTokensByProject = function (variables) {
  return {
    query: `
      query TokensByProject($first: Int, $skip: Int, $project: String, $orderBy: String, $orderDirection: String) {
        tokens(first: $first, skip: $skip, where: {project: $project}, orderBy: $orderBy, orderDirection: $orderDirection) {
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
          listings (orderBy: createdAt, orderDirection: desc, first: 1) {
            id
            from
            price
            eventType
            createdAt
          }
        }
      }
    `,
    ...variables,
  }
}

const queryTokensByCreator = function (variables) {
  return {
    query: `
      query TokensByCreator($first: Int, $skip: Int, $creator: String, $orderBy: String, $orderDirection: String) {
        tokens(first: $first, skip: $skip, where: {creator: $creator}, orderBy: $orderBy, orderDirection: $orderDirection) {
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
          }
          listings (orderBy: createdAt, orderDirection: desc, first: 1) {
            id
            from
            price
            eventType
            createdAt
          }
        }
      }
    `,
    ...variables,
  }
}

const queryTokensByOwner = function (variables) {
  return {
    query: `
      query TokensByOwner($first: Int, $skip: Int, $owner: String, $orderBy: String, $orderDirection: String) {
        tokens(first: $first, skip: $skip, where: {owner: $owner}, orderBy: $orderBy, orderDirection: $orderDirection) {
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
          }
          listings (orderBy: createdAt, orderDirection: desc, first: 1) {
            id
            from
            price
            eventType
            createdAt
          }
        }
      }
    `,
    ...variables,
  }
}

const queryOffersByToken = function (variables) {
  return {
    query: `
      query OffersByToken($first: Int, $skip: Int, $id: String) {
        offers (first: $first, skip: $skip, orderBy: createdAt, orderDirection: desc, where: {token: $id}) {
          id
          from
          price
          deadline
          isAccepted
          createdAt
          updatedAt
          txHash
          sale {
              id
          }
          _db_merge
        }
      }
    `,
    ...variables,
  }
}

const queryTokenHistory = function (variables) {
  return {
    query: `
      query TokenHistory($id: String) {
        token (id: $id) {
          txHash
          tokenId
          creator
          createdAt
          project {
              id
          }
          transfers (orderBy: createdAt, orderDirection: desc) {
            id
            from
            to
            createdAt
          }
          offers (orderBy: createdAt, orderDirection: desc) {
            id
            txHash
            from
            price
            deadline
            isAccepted
            createdAt
            updatedAt
          }
          sales (orderBy: createdAt, orderDirection: desc) {
            id
            from
            to
            price
            createdAt
          }
          listings (orderBy: createdAt, orderDirection: desc) {
            id
            from
            price
            eventType
            createdAt
          }
          _db_merge
        }
      }
    `,
    ...variables,
  }
}

export {
  graphql,
  queryProject,
  queryProjects,
  queryHighlightedProjects,
  queryProjectsByCreator,
  queryToken,
  queryTokensInIdArray,
  queryTokens,
  queryTokensByProject,
  queryTokensByCreator,
  queryTokensByOwner,
  queryOffersByToken,
  queryTokenHistory,
}
