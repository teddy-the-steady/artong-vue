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
    let style = getComputedStyle(el)

    height -=
      parseFloat(style.paddingTop) +
      parseFloat(style.paddingBottom) +
      parseFloat(style.borderTopWidth) +
      parseFloat(style.borderBottomWidth)

    return height
  }

  static getWidth(el) {
    let width = el.offsetWidth
    let style = getComputedStyle(el)

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
        let style = getComputedStyle(el)
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
        let style = getComputedStyle(el)
        height += parseFloat(style.marginTop) + parseFloat(style.marginBottom)
      }

      return height
    } else {
      return 0
    }
  }
  static getOffset(el) {
    var rect = el.getBoundingClientRect()

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
}
