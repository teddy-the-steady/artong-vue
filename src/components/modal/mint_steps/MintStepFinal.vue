<template>
  <div class="mint-final">
    <div class="imagebox">
      <img
        v-if="project.project_thumbnail_s3key || project.project_s3key"
        :src="
          makeS3Path(project.project_thumbnail_s3key || project.project_s3key)
        "
      />
      <div v-else :style="{ background: backgroundColor }"></div>
    </div>
    <img src="../../../assets/icons/double-arrow-left.svg" />
    <div class="imagebox">
      <img :src="makeS3Path(slotData.slotData.postResult.content_s3key)" />
    </div>
  </div>
</template>

<script>
import { makeS3Path } from '../../../util/commonFunc'
import { backgroundColor } from '../../../mixin'

export default {
  name: 'MintStepFinal',
  mixins: [backgroundColor],
  props: {
    project: {
      type: Object,
      default: () => {},
    },
    slotData: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    backgroundColor() {
      return this.generateGradientBackground(this.project.id)
    },
  },
  methods: {
    makeS3Path(path) {
      return makeS3Path(path)
    },
  },
}
</script>

<style lang="scss" scoped>
@import '../../../assets/scss/variables';

.mint-final {
  display: flex;
  justify-content: space-evenly;
  .imagebox {
    width: 100px;
    height: 100px;
    overflow: hidden;
    display: flex;
    align-items: center;

    img {
      width: 100%;
      object-fit: cover;
    }

    div {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
