<template>
  <div>
    <div class="header">
      <div class="background" :style="{'background': backgroundColor}"></div>
      <div class="user-info">
        <project-page-profile></project-page-profile>
      </div>
      <div class="tab">
      </div>
    </div>
    <content-list></content-list>
  </div>
</template>

<script>
import { backgroundColor } from '../../mixin'
import ContentList from '../contentsV2/ContentList'
import ProjectPageProfile from '../profile/ProjectPageProfile'
import { getProject } from '../../api/projects'

export default {
  name: 'Project',
  mixins: [backgroundColor],
  components: {
    ContentList, ProjectPageProfile
  },
  data() {
    return {
      projectAddress: ''
    }
  },
  created() {
    this.projectAddress = this.$route.params.id
    this.backgroundColor = this.generateGradientBackground(this.projectAddress)
  },
  async beforeRouteEnter(to, from, next) {
    const result = await getProject(to.params.id)
    console.log(result)
    // TODO] 로딩으로 화면 막기
    next()
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/variables';

.header {
  .background {
    height: 15em;
  }
  .user-info {
    height: 30%;
    button {
      padding: 10px;
      border-radius: 10px;
    }
  }

  .tab {
    height: 50px;
  }
}

.contents {
  padding: 0 10%;
}

@media only screen and (max-width: 599px) {
  .header {
    .user-info {
      display: flex;
      justify-content: center;

      button {
        border-radius: 10px;
      }
    }
  }

  .contents {
    padding: 0;
  }
}
</style>
