<template>
  <div
    class="v-sidebar-menu"
    :class="[theme ? `art_${theme}` : '']"
    :style="{ 'max-width': sidebarWidth }"
  >
    <slot name="header" />
    <div class="art--scroll-wrapper">
      <div class="art--list">
        <SidebarMenuItem
          v-for="(item, index) in menu"
          :key="index"
          :item="item"
          :active-show="activeShow"
          :show-one-child="showOneChild"
          :show-child="showChild"
        >
          <slot slot="dropdown-icon" name="dropdown-icon" />
        </SidebarMenuItem>
      </div>
    </div>
    <slot name="footer" />
    <div class="art--footer">
      <LightDarkSwitch></LightDarkSwitch>
    </div>
  </div>
</template>

<script>
import SidebarMenuItem from './SidebarMenuItem.vue'
import LightDarkSwitch from '../util/LightDarkSwitch.vue'

export default {
  name: 'SidebarMenu',
  components: {
    SidebarMenuItem,
    LightDarkSwitch,
  },
  props: {
    menu: {
      type: Array,
      required: true,
    },
    width: {
      type: String,
      default: '300px',
    },
    showChild: {
      type: Boolean,
      default: false,
    },
    theme: {
      type: String,
      default: '',
    },
    showOneChild: {
      type: Boolean,
      default: false,
    },
    hideToggle: {
      type: Boolean,
      default: false,
    },
    relative: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      activeShow: null,
    }
  },
  computed: {
    sidebarWidth() {
      return this.width
    },
  },
  methods: {
    onActiveShow(item) {
      this.activeShow = item
    },
    onItemClick(event, item) {
      this.$emit('item-click', event, item)
    },
    onItemUpdate(newItem, item) {
      if (item === this.activeShow) {
        this.activeShow = newItem
      }
    },
  },
  provide() {
    return {
      emitActiveShow: this.onActiveShow,
      emitItemClick: this.onItemClick,
      emitItemUpdate: this.onItemUpdate,
    }
  },
}
</script>

<style lang="scss">
@import './vue-sidebar-menu';
</style>
