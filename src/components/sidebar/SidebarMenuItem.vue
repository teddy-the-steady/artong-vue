<template>
  <component
    :is="item.component"
    v-if="item.component"
    v-bind="item.props"
  />
  <div
    v-else-if="item.header"
    class="art--header"
    :class="item.class"
    v-bind="item.attributes"
  >
    {{ item.title }}
  </div>
  <div
    v-else
    class="art--item"
    :class="[{'art--item_open' : show}]"
    @mouseout="mouseLeaveEvent"
  >
    <sidebar-menu-link
      :tag="item.disabled || !itemLinkHref ? 'span' : (isRouterLink ? 'router-link' : 'a')"
      :href="itemLinkHref"
      :disabled="item.disabled"
      :class="itemLinkClass"
      v-bind="item.attributes"
      @click.native="clickEvent"
    >
      <sidebar-menu-icon
        v-if="item.icon"
        :icon="item.icon"
      />
      <template>
        <sidebar-menu-badge
          v-if="item.badge"
          :badge="item.badge"
          :style="[item.child ? {'margin-right' : '30px'} : '']"
        />
        <span class="art--title">{{ item.title }}</span>
        <div
          v-if="item.child"
          class="art--arrow"
          :class="[{'art--arrow_open' : show}, {'art--arrow_slot' : $slots['dropdown-icon']}]"
        >
          <slot name="dropdown-icon" />
        </div>
      </template>
    </sidebar-menu-link>
    <template v-if="item.child">
      <template>
        <transition
          name="expand"
          @enter="expandEnter"
          @afterEnter="expandAfterEnter"
          @beforeLeave="expandBeforeLeave"
        >
          <div
            v-if="show"
            class="art--dropdown"
          >
            <div class="art--list">
              <sidebar-menu-item
                v-for="(subItem, index) in item.child"
                :key="index"
                :item="subItem"
                :level="level+1"
                :show-child="showChild"
              >
                <slot
                  slot="dropdown-icon"
                  name="dropdown-icon"
                />
              </sidebar-menu-item>
            </div>
          </div>
        </transition>
      </template>
    </template>
  </div>
</template>

<script>
import { itemMixin, animationMixin } from '../../mixin'
import SidebarMenuLink from './SidebarMenuLink'
import SidebarMenuIcon from './SidebarMenuIcon'
import SidebarMenuBadge from './SidebarMenuBadge'

export default {
  name: 'SidebarMenuItem',
  components: {
    SidebarMenuLink,
    SidebarMenuIcon,
    SidebarMenuBadge
  },
  mixins: [itemMixin, animationMixin],
  props: {
    item: {
      type: Object,
      required: true
    },
    level: {
      type: Number,
      default: 1
    },
    activeShow: {
      type: Object,
      default: null
    },
    showChild: {
      type: Boolean,
      default: false
    },
    showOneChild: {
      type: Boolean,
      default: false
    }
  }
}
</script>