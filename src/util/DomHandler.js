export default class DomHandler {
  static addClass(element, className) {
    if (element.classList) element.classList.add(className)
    else element.className += ' ' + className
  }

  static removeClass(element, className) {
    if (element.classList) element.classList.remove(className)
    else
      element.className = element.className.replace(
        new RegExp(
          '(^|\\b)' + className.split(' ').join('|') + '(\\b|$)',
          'gi',
        ),
        ' ',
      )
  }

  static getHeight(el) {
    let height = el.offsetHeight
    const style = getComputedStyle(el)

    height -=
      parseFloat(style.paddingTop) +
      parseFloat(style.paddingBottom) +
      parseFloat(style.borderTopWidth) +
      parseFloat(style.borderBottomWidth)

    return height
  }

  static getWidth(el) {
    let width = el.offsetWidth
    const style = getComputedStyle(el)

    width -=
      parseFloat(style.paddingLeft) +
      parseFloat(style.paddingRight) +
      parseFloat(style.borderLeftWidth) +
      parseFloat(style.borderRightWidth)

    return width
  }

  static getOuterWidth(el, margin) {
    if (el) {
      let width = el.offsetWidth

      if (margin) {
        const style = getComputedStyle(el)
        width += parseFloat(style.marginLeft) + parseFloat(style.marginRight)
      }

      return width
    } else {
      return 0
    }
  }

  static getOuterHeight(el, margin) {
    if (el) {
      let height = el.offsetHeight

      if (margin) {
        const style = getComputedStyle(el)
        height += parseFloat(style.marginTop) + parseFloat(style.marginBottom)
      }

      return height
    } else {
      return 0
    }
  }

  static getOffset(el) {
    const rect = el.getBoundingClientRect()

    return {
      top:
        rect.top +
        (window.pageYOffset ||
          document.documentElement.scrollTop ||
          document.body.scrollTop ||
          0),
      left:
        rect.left +
        (window.pageXOffset ||
          document.documentElement.scrollLeft ||
          document.body.scrollLeft ||
          0),
    }
  }

  static hasClass(element, className) {
    if (element) {
      if (element.classList) return element.classList.contains(className)
      else
        return new RegExp('(^| )' + className + '( |$)', 'gi').test(
          element.className,
        )
    }

    return false
  }

  static generateZIndex() {
    this.zindex = this.zindex || 999
    return ++this.zindex
  }

  static absolutePosition(element, target) {
    const elementDimensions = element.offsetParent
      ? { width: element.offsetWidth, height: element.offsetHeight }
      : this.getHiddenElementDimensions(element)
    const elementOuterHeight = elementDimensions.height
    const elementOuterWidth = elementDimensions.width
    const targetOuterHeight = target.offsetHeight
    const targetOuterWidth = target.offsetWidth
    const targetOffset = target.getBoundingClientRect()
    const windowScrollTop = this.getWindowScrollTop()
    const windowScrollLeft = this.getWindowScrollLeft()
    const viewport = this.getViewport()
    let top, left

    if (
      targetOffset.top + targetOuterHeight + elementOuterHeight >
      viewport.height
    ) {
      top = targetOffset.top + windowScrollTop - elementOuterHeight
      element.style.transformOrigin = 'bottom'

      if (top < 0) {
        top = windowScrollTop
      }
    } else {
      top = targetOuterHeight + targetOffset.top + windowScrollTop
      element.style.transformOrigin = 'top'
    }

    if (targetOffset.left + elementOuterWidth > viewport.width)
      left = Math.max(
        0,
        targetOffset.left +
          windowScrollLeft +
          targetOuterWidth -
          elementOuterWidth,
      )
    else left = targetOffset.left + windowScrollLeft

    element.style.top = top + 'px'
    element.style.left = left + 'px'
  }

  static relativePosition(element, target) {
    const elementDimensions = element.offsetParent
      ? { width: element.offsetWidth, height: element.offsetHeight }
      : this.getHiddenElementDimensions(element)
    const targetHeight = target.offsetHeight
    const targetOffset = target.getBoundingClientRect()
    const viewport = this.getViewport()
    let top, left

    if (
      targetOffset.top + targetHeight + elementDimensions.height >
      viewport.height
    ) {
      top = -1 * elementDimensions.height
      element.style.transformOrigin = 'bottom'
      if (targetOffset.top + top < 0) {
        top = -1 * targetOffset.top
      }
    } else {
      top = targetHeight
      element.style.transformOrigin = 'top'
    }

    if (elementDimensions.width > viewport.width) {
      // element wider then viewport and cannot fit on screen (align at left side of viewport)
      left = targetOffset.left * -1
    } else if (targetOffset.left + elementDimensions.width > viewport.width) {
      // element wider then viewport but can be fit on screen (align at right side of viewport)
      left = (targetOffset.left + elementDimensions.width - viewport.width) * -1
    } else {
      // element fits on screen (align with target)
      left = 0
    }

    element.style.top = top + 'px'
    element.style.left = left + 'px'
  }

  static isTouchDevice() {
    return (
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      navigator.msMaxTouchPoints > 0
    )
  }

  static findSingle(element, selector) {
    return element.querySelector(selector)
  }
}
