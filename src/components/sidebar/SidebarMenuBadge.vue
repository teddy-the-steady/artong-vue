<template>
  <component
    class="art--badge"
    :class="badge.class"
    :is="badge.element ? badge.element : 'span'"
    v-bind="badge.attributes"
  >
    {{ badge.text }}
  </component>
</template>

<script>
export default {
  name: 'SidebarMenuBadge',
  props: {
    badge: {
      type: Object,
      default: () => {}
    }
  }
}
</script>
