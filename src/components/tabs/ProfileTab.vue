<template>
  <div>
    <div class="tabs">
      <profile-tab-item
        v-for="item in list"
        v-bind="item" :key="item.id"
        v-model="currentId"/>
    </div>
    <div class="contents">
      <transition>
        <section class="item" :key="currentId">
          {{ current.content }}
        </section>
      </transition>
    </div>
  </div>
</template>

<script>
import ProfileTabItem from './ProfileTabItem'

export default {
  name: 'ProfileTab',
  components: {
    ProfileTabItem
  },
  data() {
    return {
      currentId: 1,
      list: [
        { id: 1, label: 'Tab1', content: '콘텐츠1' },
        { id: 2, label: 'Tab2', content: '콘텐츠2' },
        { id: 3, label: 'Tab3', content: '콘텐츠3' }
      ]
    }
  },
  computed: {
    current() {
      return this.list.find(el => el.id === this.currentId) || {}
    }
  }
}
</script>

<style lang="scss" scoped>
.contents {
  position: relative;
  overflow: hidden;
  width: 280px;
  border: 2px solid #000;

  .item {
    box-sizing: border-box;
    padding: 10px;
    width: 100%;
    transition: all 0.8s ease;
  }
}

/* 트랜지션 전용 스타일 */
.v-leave-active {
  position: absolute;
}
.v-enter {
  transform: translateX(-100%);
}
.v-leave-to {
  transform: translateX(100%);
}
</style>