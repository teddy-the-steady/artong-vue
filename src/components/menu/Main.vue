<template>
  <div>
    메인 화면 입니다(비로그인)
    로그인 후엔 home화면이 보여집니다.
  </div>
</template>

<script>
import { headerActivate } from '../../mixin'

export default {
  name: 'Main',
  mixins: [headerActivate],
}
</script>

<style lang="scss" scoped>
</style>
