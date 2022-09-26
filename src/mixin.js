export const itemMixin = {
  data() {
    return {
      active: false,
      exactActive: false,
      itemShow: false,
      itemHover: false
    }
  },
  created() {
    if (this.item.header || this.item.component) return
    this.initState()

    if (!this.$router) {
      window.addEventListener('hashchange', this.initState)
    }
  },
  destroyed() {
    if (!this.$router) {
      window.removeEventListener('hashchange', this.initState)
    }
  },
  methods: {
    isLinkActive(item) {
      return this.matchRoute(item) || this.isChildActive(item.child)
    },
    isLinkExactActive(item) {
      return this.matchExactRoute(item.href)
    },
    isChildActive(child) {
      if (!child) return false
      return child.some(item => {
        return this.isLinkActive(item)
      })
    },
    matchRoute({ href, exactPath }) {
      if (!href) return false
      if (this.$router) {
        const { route } = this.$router.resolve(href)
        return exactPath ? route.path === this.$route.path : this.matchExactRoute(href)
      } else {
        return exactPath ? href === window.location.pathname : this.matchExactRoute(href)
      }
    },
    matchExactRoute(href) {
      if (!href) return false
      if (this.$router) {
        const { route } = this.$router.resolve(href)
        return route.fullPath === this.$route.fullPath
      } else {
        return href === window.location.pathname + window.location.search + window.location.hash
      }
    },
    clickEvent(event) {
      if (this.item.disabled) return

      this.emitItemClick(event, this.item)

      if (this.showChild) return
      if (this.item.child && (!this.item.href || this.exactActive)) {
        if (this.showOneChild) {
          this.activeShow === this.item ? this.emitActiveShow(null) : this.emitActiveShow(this.item)
        } else {
          this.itemShow = !this.itemShow
        }
      }
    },
    initState() {
      this.initActiveState()
      this.initShowState()
    },
    initActiveState() {
      this.active = this.isLinkActive(this.item)
      this.exactActive = this.isLinkExactActive(this.item)
    },
    initShowState() {
      if (this.item.child && !this.showChild) {
        if (this.showOneChild) {
          if (this.active) {
            this.emitActiveShow(this.item)
            this.itemShow = true
          } else {
            if (this.item === this.activeShow) {
              this.emitActiveShow(null)
              this.itemShow = false
            }
          }
        } else {
          if (this.active) {
            this.itemShow = true
          }
        }
      }
    },
    mouseEnterEvent(event) {
      event.stopPropagation()
      if (this.item.disabled) return
      this.itemHover = true
    },
    mouseLeaveEvent(event) {
      event.stopPropagation()
      this.itemHover = false
    }
  },
  computed: {
    isRouterLink() {
      return (this.$router && this.item && this.item.href !== undefined && !this.item.external) === true
    },
    isFirstLevel() {
      return this.level === 1
    },
    show() {
      if (!this.item.child) return false
      if (this.showChild) return true
      return this.itemShow
    },
    itemLinkClass() {
      return [
        'art--link',
        `art--link_level-${this.level}`,
        { 'art--link_hover': this.hover },
        { 'art--link_active': this.active },
        { 'art--link_exact-active': this.exactActive },
        { 'art--link_disabled': this.item.disabled },
        this.item.class
      ]
    },
    itemLinkHref() {
      if (!this.$router && (!this.item.href || typeof this.item.href !== 'string')) return ''
      return this.item.href ? this.item.href : ''
    },
    hover() {
      return this.itemHover
    }
  },
  watch: {
    $route() {
      setTimeout(() => {
        if (this.item.header || this.item.component) return
        this.initState()
      }, 1)
    },
    item(newItem, item) {
      this.emitItemUpdate(newItem, item)
    },
    activeShow() {
      this.itemShow = this.item === this.activeShow
    }
  },
  inject: ['emitActiveShow', 'emitItemClick', 'emitItemUpdate']
}

export const menuDeactivate = {
  activated() {
    this.$store.commit('SET_HEAD_NAV_FALSE')
    this.$store.commit('SET_SIDE_MENU_FALSE')
  }
}

export const headerActivate = {
  activated() {
    this.$store.commit('SET_HEAD_NAV_TRUE')
  }
}

export const backgroundColor = {
  methods: {
    generateGradientBackground(address) {
      let color1, color2 = null

      if (address && typeof address === 'string' && address.startsWith('0x')) {
        const hexString = address.split('x')[1]
        color1 = '#' + hexString.slice(0, 6)
        color2 = '#' + hexString.slice(hexString.length - 6, hexString.length)
      } else {
        const hexValues = ['0','1','2','3','4','5','6','7','8','9','a','b','c','d','e']
        const populate = function(a) {
          for (let i = 0; i < 6; i++ ) {
            const x = Math.round( Math.random() * 14 )
            const y = hexValues[x]
            a += y
          }
          return a
        }
    
        color1 = populate('#')
        color2 = populate('#')
      }
      const angle = Math.round( Math.random() * 360 )
      const gradient = 'linear-gradient(' + angle + 'deg, ' + color1 + ', ' + color2 + ')'
      return gradient
    }
  }
}
