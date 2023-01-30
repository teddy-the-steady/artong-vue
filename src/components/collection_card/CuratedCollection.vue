<template>
  <carousel
    :perPageCustom="[
      [360, 1],
      [600, 2],
      [1080, 3],
      [1440, 4],
    ]"
    :autoplay="true"
    :autoplayHoverPause="true"
    :loop="true"
    :scrollPerPage="true"
    paginationColor="#B3B3B3"
    paginationActiveColor="#F22E3E"
  >
    <slide v-for="(project, i) in projects" :key="i">
      <ProjectCard :project="project"></ProjectCard>
    </slide>
  </carousel>
</template>
<script>
import ProjectCard from '../projects/ProjectCard.vue'

export default {
  name: 'CuratedCollection',
  components: {
    ProjectCard,
  },
  data() {
    return {}
  },
  props: {
    projects: {
      type: Object,
      default: null,
    },
  },
  methods: {
    getTestNumber() {},
  },
  // methods: {
  //     handleSlideClick(dataset)=>{
  //         console.log(dataset.index, dataset.name)
  //     }
  // }
}
</script>

<style lang="scss" scoped></style>
