<template>
  <carousel
    :perPageCustom="[
      [360, 1],
      [400, 1.2],
      [500, 1.5],
      [600, 1.8],
      [700, 2],
      [840, 2.2],
    ]"
    :autoplay="true"
    :autoplayHoverPause="true"
    :loop="true"
    :scrollPerPage="true"
    paginationColor="#B3B3B3"
    paginationActiveColor="#F22E3E"
  >
    <slide v-for="i in testNumber" :key="i">
      <ProjectCard></ProjectCard>
    </slide>
  </carousel>
</template>
<script>
import ProjectCard from '../projects_v2/ProjectCard.vue'

export default {
  name: 'CuratedCollection',
  components: {
    ProjectCard,
  },
  data() {
    return {
      testNumber: 10, // slide의 개수
    }
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
