/*!
 * vue-masonry-css v1.0.3
 * https://github.com/paulcollett/vue-masonry-css
 * Released under the MIT License.
 */

// the component name `<masonry />`
// can be overridden with `Vue.use(Masonry, { name: 'the-masonry' });`
var componentName = 'masonry'

var props = {
  tag: {
    type: [String],
    default: 'div'
  },
  cols: {
    type: [Object, Number, String],
    default: 2
  },
  gutter: {
    type: [Object, Number, String],
    default: 0
  },
  css: {
    type: [Boolean],
    default: true
  },
  columnTag: {
    type: [String],
    default: 'div'
  },
  columnClass: {
    type: [String, Array, Object],
    default: function() { return [] }
  },
  columnAttr: {
    type: [Object],
    default: function() { return ({}) }
  }
}

// Get the resulting value from  `:col=` prop
// based on the window width
var breakpointValue = function(mixed, windowWidth) {
  var valueAsNum = parseInt(mixed)

  if (valueAsNum > -1) {
    return mixed
  } else if (typeof mixed !== 'object') {
    return 0
  }

  var matchedBreakpoint = Infinity
  var matchedValue = mixed.default || 0

  for (var k in mixed) {
    var breakpoint = parseInt(k)
    var breakpointValRaw = mixed[breakpoint]
    var breakpointVal = parseInt(breakpointValRaw)

    if (isNaN(breakpoint) || isNaN(breakpointVal)) {
      continue
    }

    var isNewBreakpoint = windowWidth <= breakpoint && breakpoint < matchedBreakpoint

    if (isNewBreakpoint) {
      matchedBreakpoint = breakpoint
      matchedValue = breakpointValRaw
    }
  }

  return matchedValue
}

var component = {
  props: props,

  data() {
    return {
      displayColumns: 2,
      displayGutter: 0
    }
  },

  mounted() {
    this.$nextTick(() => {
      this.reCalculate()
    })

    // Bind resize handler to page
    if (window) {
      window.addEventListener('resize', this.reCalculate)
    }
  },

  updated() {
    // TODO] 그려지기 전에 그림 위치값 가져오기는 불가능??
    // var htmlCollection = this.$refs['masonryEl-0'].getElementsByClassName('content')
    // console.log(Array.prototype.map.call(htmlCollection, (val) => { return val.offsetTop }))

    this.$nextTick(() => {
      this.reCalculate()
    })
  },

  beforeDestroy() {
    if (window) {
      window.removeEventListener('resize', this.reCalculate)
    }
  },

  methods: {
    // Recalculate how many columns to display based on window width
    // and the value of the passed `:cols=` prop
    reCalculate: function reCalculate() {
      var previousWindowWidth = this.windowWidth
      this.windowWidth = (window ? window.innerWidth : null) || Infinity

      // Window resize events get triggered on page height
      // change which when loading the page can result in multiple
      // needless calculations. We prevent this here.
      if (previousWindowWidth === this.windowWidth) {
        return
      }

      this._reCalculateColumnCount(this.windowWidth)

      this._reCalculateGutterSize(this.windowWidth)
    },

    _reCalculateGutterSize: function _reCalculateGutterSize(windowWidth) {
      this.displayGutter = breakpointValue(this.gutter, windowWidth)
    },

    _reCalculateColumnCount: function _reCalculateColumnCount(windowWidth) {
      var newColumns = breakpointValue(this.cols, windowWidth)

      // Make sure we can return a valid value
      newColumns = Math.max(1, Number(newColumns) || 0)

      this.displayColumns = newColumns
    },

    _getChildItemsInColumnsArray: function _getChildItemsInColumnsArray() {
      var columns = []
      var childItems = this.$slots.default || []

      // This component does not work with a child <transition-group /> ..yet,
      // so for now we think it may be helpful to ignore until we can find a way for support
      if (childItems.length === 1 && childItems[0].componentOptions && childItems[0].componentOptions.tag === 'transition-group') {
        childItems = childItems[0].componentOptions.children
      }

      // Loop through child elements
      for (var i = 0, visibleItemI = 0; i < childItems.length; i++, visibleItemI++) {
        // skip Vue elements without tags, which includes
        // whitespace elements and also plain text
        if (!childItems[i].tag) {
          visibleItemI--

          continue
        }

        // Get the column index the child item will end up in
        var columnIndex = visibleItemI % this.displayColumns

        if (!columns[columnIndex]) {
          columns[columnIndex] = []
        }

        columns[columnIndex].push(childItems[i])
      }

      return columns
    }
  },

  render(createElement) {
    console.log('render')
    var columnsContainingChildren = this._getChildItemsInColumnsArray()
    var isGutterSizeUnitless = parseInt(this.displayGutter) === this.displayGutter * 1
    var gutterSizeWithUnit = isGutterSizeUnitless ? ((this.displayGutter) + 'px') : this.displayGutter

    var columnStyle = {
      boxSizing: 'border-box',
      backgroundClip: 'padding-box',
      width: ((100 / this.displayColumns) + '%'),
      border: '0 solid transparent',
      borderLeftWidth: gutterSizeWithUnit,
      margin: '0 10px'
    }

    var columns = columnsContainingChildren.map((children, index) => {
      /// Create column element and inject the children
      return createElement(this.columnTag, {
        key: index + '-' + columnsContainingChildren.length,
        style: this.css ? columnStyle : null,
        class: this.columnClass,
        attrs: this.columnAttr,
        ref: 'masonryEl-' + index
      }, children) // specify child items here
    })

    var containerStyle = {
      display: ['-webkit-box', '-ms-flexbox', 'flex'],
      marginLeft: ('-' + gutterSizeWithUnit)
    }

    // Return wrapper with columns
    return createElement(
      this.tag, // tag name
      this.css ? { style: containerStyle } : null, // element options
      columns // column vue elements
    )
  }
}

var Plugin = function() {}

Plugin.install = function(Vue, options) {
  if (Plugin.installed) {
    return
  }

  if (options && options.name) {
    Vue.component(options.name, component)
  } else {
    Vue.component(componentName, component)
  }
}

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(Plugin)
}

export default Plugin
