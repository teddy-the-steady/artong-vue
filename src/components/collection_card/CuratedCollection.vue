<template>
  <carousel
    :perPageCustom="[
      [360, 1],
      [570, 1.5],
      [750, 2],
      [1080, 2.5],
      [1250, 3],
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
      <router-link
        :to="{
          name: 'Project',
          params: {
            id: project.slug || project.id || project.address,
          },
        }"
      >
        <ProjectCard :project="project"></ProjectCard>
      </router-link>
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
    projects: {},
  },
}
</script>

<style lang="scss" scoped></style>
