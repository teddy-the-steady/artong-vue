<template>
  <component
    class="art--icon"
    :class="
      typeof icon === 'string' || icon instanceof String ? icon : icon.class
    "
    :is="icon.element ? icon.element : 'i'"
    v-bind="icon.attributes"
  >
    {{ icon.text }}
  </component>
</template>

<script>
export default {
  name: 'SidebarMenuIcon',
  props: {
    icon: {
      type: [String, Object],
      default: '',
    },
  },
}
</script>
