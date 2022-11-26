// INFO] router에 담긴 param들을 created 훅 이전에 가져와서 세팅하기 위한 모듈
// https://github.com/vuejs/vue-router/issues/1144#issuecomment-323525366
export default (loadData) => {
  let loaderCallback = () => {}
  const loadRoute = (to, from, next) => {
    loadData(to, (callback) => {
      loaderCallback = callback
      next()
    })
  }
  return {
    beforeRouteEnter: loadRoute,
    beforeRouteUpdate: loadRoute,
    created() {
      loaderCallback.apply(this)
    },
    watch: {
      $route() {
        loaderCallback.apply(this)
      },
    },
  }
}
