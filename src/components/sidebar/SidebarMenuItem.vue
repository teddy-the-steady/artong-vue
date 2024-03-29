<template>
  <component :is="item.component" v-if="item.component" v-bind="item.props" />
  <div
    class="art--header"
    :class="item.class"
    v-else-if="item.header"
    v-bind="item.attributes"
  >
    {{ item.title }}
  </div>
  <div
    class="art--item"
    :class="[{ 'art--item_open': show }]"
    v-else
    @mouseout="mouseLeaveEvent"
  >
    <SidebarMenuLink
      :class="itemLinkClass"
      :tag="
        item.disabled || !itemLinkHref
          ? 'span'
          : isRouterLink
          ? 'router-link'
          : 'a'
      "
      :href="itemLinkHref"
      :disabled="item.disabled"
      v-bind="item.attributes"
      @click.native="clickEvent"
    >
      <SidebarMenuIcon v-if="item.icon" :icon="item.icon" />
      <template>
        <SidebarMenuBadge
          v-if="item.badge"
          :badge="item.badge"
          :style="[item.child ? { 'margin-right': '30px' } : '']"
        />
        <span class="art--title">{{ item.title }}</span>
        <div
          class="art--arrow"
          :class="[
            { 'art--arrow_open': show },
            { 'art--arrow_slot': $slots['dropdown-icon'] },
          ]"
          v-if="item.child"
        >
          <slot name="dropdown-icon" />
        </div>
      </template>
    </SidebarMenuLink>
    <template v-if="item.child">
      <template>
        <div class="art--dropdown" v-if="show">
          <div class="art--list">
            <sidebar-menu-item
              v-for="(subItem, index) in item.child"
              :key="index"
              :item="subItem"
              :level="level + 1"
              :show-child="showChild"
            >
              <slot slot="dropdown-icon" name="dropdown-icon" />
            </sidebar-menu-item>
          </div>
        </div>
      </template>
    </template>
  </div>
</template>

<script>
import { itemMixin } from '../../mixin'
import SidebarMenuLink from './SidebarMenuLink.vue'
import SidebarMenuIcon from './SidebarMenuIcon.vue'
import SidebarMenuBadge from './SidebarMenuBadge.vue'

export default {
  name: 'SidebarMenuItem',
  components: {
    SidebarMenuLink,
    SidebarMenuIcon,
    SidebarMenuBadge,
  },
  mixins: [itemMixin],
  props: {
    item: {
      type: Object,
      required: true,
    },
    level: {
      type: Number,
      default: 1,
    },
    activeShow: {
      type: Object,
      default: null,
    },
    showChild: {
      type: Boolean,
      default: false,
    },
    showOneChild: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
