import instance from './index'

const getNotifications = async function (number = 1) {
  const result = await instance.get('/notification/get', {
    params: {
      page: number,
    },
  })
  return result.data
}

const patchNotifications = async function () {
  const result = await instance.patch('/notification/read', {
    notificationIds: [],
  })
  return result.data
}

export { getNotifications, patchNotifications }
