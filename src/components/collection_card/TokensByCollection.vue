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
    paginationActiveColor="#000000"
  >
    <slide v-for="(content, i) in tokens" :key="i">
      <ContentCard
        :content="content"
        :needContentName="needContentName"
      ></ContentCard>
    </slide>
  </carousel>
</template>
<script>
import ContentCard from '../contents_v3/ContentCard.vue'

export default {
  name: 'TokensByCollection',
  components: {
    ContentCard,
  },
  props: {
    tokens: {},
    needContentName: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
