<template>
  <carousel
    :perPageCustom="[
      [360, 1],
      [400, 1.2],
      [500, 1.5],
      [600, 1.8],
      [700, 2],
      [840, 2.2],
      [1080, 2.9],
      [1440, 3.9],
      [1920, 4],
    ]"
    :autoplay="true"
    :autoplayHoverPause="true"
    :loop="true"
    :scrollPerPage="true"
    paginationColor="#B3B3B3"
    paginationActiveColor="#000000"
  >
    <slide v-for="i in testNumber" :key="i">
      <ContentCard></ContentCard>
    </slide>
  </carousel>
</template>
<script>
import ContentCard from '../contents_v3/ContentCard.vue'

export default {
  name: 'CuratedCollection',
  components: {
    ContentCard,
  },
  data() {
    return {
      testNumber: 10, // slide의 개수
    }
  },
}
</script>
